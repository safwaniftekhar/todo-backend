import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { NotificationsGateway } from 'src/notifications.gateway';

@Injectable()
export class MembershipsService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsGateway,
  ) {}

  private async isOwner(appId: string, userId: string): Promise<boolean> {
    const app = await this.prisma.todoApp.findUnique({ where: { id: appId } });
    if (!app) throw new NotFoundException('App not found');
    return app.ownerId === userId;
  }

  async listMembers(appId: string, userId: string) {
    if (!(await this.isOwner(appId, userId))) {
      throw new ForbiddenException('Only owner can view members');
    }

    return this.prisma.membership.findMany({
      where: { todoAppId: appId },
      include: { user: { select: { id: true, email: true } } },
    });
  }

  async inviteMember(appId: string, userId: string, email: string, role: Role) {
    if (!(await this.isOwner(appId, userId))) {
      throw new ForbiddenException('Only owner can invite');
    }

    const invitedUser = await this.prisma.user.findUnique({ where: { email } });
    if (!invitedUser) throw new NotFoundException('User not found');

    const existing = await this.prisma.membership.findFirst({
      where: { todoAppId: appId, userId: invitedUser.id },
    });
    if (existing) throw new ForbiddenException('User already a member');

    // return this.prisma.membership.create({
    //   data: {
    //     todoAppId: appId,
    //     userId: invitedUser.id,
    //     role,
    //   },
    // });

    const membership = await this.prisma.membership.create({
      data: {
        userId: invitedUser.id,
        todoAppId: appId,
        role,
      },
    });

    this.notifications.notifyUser(invitedUser.id, {
      type: 'INVITATION',
      message: `You’ve been invited to a ToDo App.`,
    });

    return membership;
  }

  async updateRole(
    appId: string,
    memberId: string,
    userId: string,
    role: Role,
  ) {
    if (!(await this.isOwner(appId, userId))) {
      throw new ForbiddenException('Only owner can update roles');
    }

    return this.prisma.membership.update({
      where: { id: memberId },
      data: { role },
    });
  }

  async removeMember(appId: string, memberId: string, userId: string) {
    if (!(await this.isOwner(appId, userId))) {
      throw new ForbiddenException('Only owner can remove members');
    }

    return this.prisma.membership.delete({
      where: { id: memberId },
    });
  }
}
