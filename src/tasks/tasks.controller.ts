import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TaskStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { UpdateTaskStatusDto } from './update-task-status.dto';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':todoAppId')
  @ApiOperation({ summary: 'Create a task within a ToDo App' })
  async create(
    @Param('todoAppId') todoAppId: string,
    @Body() body: CreateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    await this.tasksService.checkEditorPermission(
      todoAppId,
      req.user['userId'],
    );
    return this.tasksService.create(
      todoAppId,
      body.title,
      req.user['userId'],
      body.dueDate,
      body.priority,
    );
  }

  @Get(':todoAppId')
  @ApiOperation({ summary: 'Get all tasks within a ToDo App' })
  findAll(
    @Param('todoAppId') todoAppId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.findAll(todoAppId, req.user['userId']);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task title' })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const todoAppId = await this.tasksService.getTodoAppIdByTaskId(id);
    await this.tasksService.checkEditorPermission(
      todoAppId,
      req.user['userId'],
    );
    return this.tasksService.update(
      id,
      req.user['userId'],
      body.title,
      body.dueDate,
      body.priority,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Change task status' })
  async changeStatus(
    @Param('id') id: string,
    @Body() body: UpdateTaskStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const todoAppId = await this.tasksService.getTodoAppIdByTaskId(id);
    await this.tasksService.checkEditorPermission(
      todoAppId,
      req.user['userId'],
    );
    return this.tasksService.changeStatus(id, body.status, req.user['userId']);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const todoAppId = await this.tasksService.getTodoAppIdByTaskId(id);
    await this.tasksService.checkEditorPermission(
      todoAppId,
      req.user['userId'],
    );
    return this.tasksService.delete(id, req.user['userId']);
  }
}
