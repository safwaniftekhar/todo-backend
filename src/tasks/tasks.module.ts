import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 adjust path if needed

@Module({
  imports: [PrismaModule], // 👈 makes PrismaService available
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
