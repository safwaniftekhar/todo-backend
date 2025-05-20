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
import { Request } from 'express';
import { TaskStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';


@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':todoAppId')
  create(
    @Param('todoAppId') todoAppId: string,
    @Body() body: { title: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.create(todoAppId, body.title, req.user['userId']);
  }

  @Get(':todoAppId')
  findAll(@Param('todoAppId') todoAppId: string, @Req() req: AuthenticatedRequest) {
    return this.tasksService.findAll(todoAppId, req.user['userId']);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title: string },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.update(id, body.title, req.user['userId']);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.changeStatus(id, body.status, req.user['userId']);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.tasksService.delete(id, req.user['userId']);
  }
}
