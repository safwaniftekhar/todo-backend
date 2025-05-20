import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoAppsService {
  constructor(private prisma: PrismaService) {}

  async create(name: string, userId: string) {
    return this.prisma.todoApp.create({
      data: {
        name,
        ownerId: userId,
        memberships: {
          create: {
            userId,
            role: 'EDITOR', // owner is also an editor
          },
        },
      },
    });
  }

  async findAllAccessible(userId: string) {
    return this.prisma.todoApp.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { memberships: { some: { userId } } },
        ],
      },
    });
  }

  async findOne(id: string, userId: string) {
    const app = await this.prisma.todoApp.findUnique({
      where: { id },
      include: { memberships: true },
    });
    if (!app) throw new ForbiddenException('App not found');
    const access = app.ownerId === userId || app.memberships.some(m => m.userId === userId);
    if (!access) throw new ForbiddenException('Access denied');
    return app;
  }

  async delete(id: string, userId: string) {
    const app = await this.prisma.todoApp.findUnique({ where: { id } });
    if (!app || app.ownerId !== userId) throw new ForbiddenException('Only the owner can delete');
    return this.prisma.todoApp.delete({ where: { id } });
  }
}
