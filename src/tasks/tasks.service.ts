import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async checkEditorPermission(todoAppId: string, userId: string) {
    const app = await this.prisma.todoApp.findUnique({
      where: { id: todoAppId },
      include: { memberships: true },
    });

    if (!app) throw new NotFoundException('ToDo app not found');

    const isEditor =
      app.ownerId === userId ||
      app.memberships.some((m) => m.userId === userId && m.role === 'EDITOR');

    if (!isEditor) throw new ForbiddenException('Editor access required');
  }

  async getTodoAppIdByTaskId(taskId: string): Promise<string> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { todoAppId: true },
    });

    if (!task) throw new NotFoundException('Task not found');
    return task.todoAppId;
  }

  async create(todoAppId: string, title: string, userId: string) {
    // Check already done in controller, but this is an extra safety check
    await this.checkEditorPermission(todoAppId, userId);

    return this.prisma.task.create({
      data: {
        title,
        todoAppId,
      },
    });
  }

  async findAll(todoAppId: string, userId: string) {
    const app = await this.prisma.todoApp.findUnique({
      where: { id: todoAppId },
      include: { memberships: true },
    });

    if (!app) throw new NotFoundException();

    const hasAccess =
      app.ownerId === userId ||
      app.memberships.some((m) => m.userId === userId);

    if (!hasAccess) throw new ForbiddenException();

    return this.prisma.task.findMany({
      where: { todoAppId },
    });
  }

  async update(taskId: string, title: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException();

    await this.checkEditorPermission(task.todoAppId, userId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: { title },
    });
  }

  async changeStatus(taskId: string, status: TaskStatus, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException();

    await this.checkEditorPermission(task.todoAppId, userId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
  }

  async delete(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) throw new NotFoundException();

    await this.checkEditorPermission(task.todoAppId, userId);

    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
