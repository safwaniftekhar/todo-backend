import { Module } from '@nestjs/common';
import { TodoAppsController } from './todo-apps.controller';
import { TodoAppsService } from './todo-apps.service';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 adjust path if needed

@Module({
  imports: [PrismaModule], // 👈 import PrismaModule
  controllers: [TodoAppsController],
  providers: [TodoAppsService],
})
export class TodoAppsModule {}
