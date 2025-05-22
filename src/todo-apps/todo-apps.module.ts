import { Module } from '@nestjs/common';
import { TodoAppsController } from './todo-apps.controller';
import { TodoAppsService } from './todo-apps.service';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], 
  controllers: [TodoAppsController],
  providers: [TodoAppsService],
})
export class TodoAppsModule {}
