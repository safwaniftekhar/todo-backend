import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TodoAppsService } from './todo-apps.service';
import { Request } from 'express';
import { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Todo Apps')
@UseGuards(JwtAuthGuard)
@Controller('todo-apps')
export class TodoAppsController {
  constructor(private todoAppsService: TodoAppsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() body: { name: string }) {
    return this.todoAppsService.create(body.name, req.user['userId']);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.todoAppsService.findAllAccessible(req.user['userId']);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoAppsService.findOne(id, req.user['userId']);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.todoAppsService.delete(id, req.user['userId']);
  }
}
