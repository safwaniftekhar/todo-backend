import {
  ForbiddenException,
  Injectable,
  Logger,
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

  async create(
    todoAppId: string,
    title: string,
    userId: string,
    dueDate?: string,
    priority?: number,
  ) {
    await this.checkEditorPermission(todoAppId, userId);

    return this.prisma.task.create({
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        todoAppId,
      },
    });
  }

  // async findAll(todoAppId: string, userId: string) {
  //   const app = await this.prisma.todoApp.findUnique({
  //     where: { id: todoAppId },
  //     include: { memberships: true },
  //   });

  //   if (!app) throw new NotFoundException();

  //   const hasAccess =
  //     app.ownerId === userId ||
  //     app.memberships.some((m) => m.userId === userId);

  //   Logger.log('app.memberships', app.memberships);

  //   if (!hasAccess) throw new ForbiddenException();

  //   const access = {
  //     role:
  //       app.ownerId === userId
  //         ? 'owner'
  //         : app?.memberships?.filter((item: any) => item?.userId === userId)[0]
  //             ?.role,
  //   };

  //   console.log('access', access);

  //   const task = this.prisma.task.findMany({
  //     where: { todoAppId },
  //   });

  //   console.log("task", task)

  //   const responseData = {
  //     tasks: task,
  //     access: access,
  //   };

  //   return responseData;
  // }

  async findAll(todoAppId: string, userId: string) {
  const app = await this.prisma.todoApp.findUnique({
    where: { id: todoAppId },
    include: { memberships: true },
  });

  if (!app) {
    throw new NotFoundException('TodoApp not found');
  }

  const hasAccess =
    app.ownerId === userId ||
    app.memberships.some((m) => m.userId === userId);

  if (!hasAccess) {
    throw new ForbiddenException('Access denied');
  }

  const access = {
    role:
      app.ownerId === userId
        ? 'owner'
        : app.memberships.find((m) => m.userId === userId)?.role ?? 'member',
  };

  Logger.log('User access', access);

  const tasks = await this.prisma.task.findMany({
    where: { todoAppId },
  });

  return {
    tasks,
    access,
  };
}


  async update(
    taskId: string,
    userId: string,
    title?: string,
    dueDate?: string,
    priority?: number,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException();

    await this.checkEditorPermission(task.todoAppId, userId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      },
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
