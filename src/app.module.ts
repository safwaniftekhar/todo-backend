import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TodoAppsModule } from './todo-apps/todo-apps.module';
import { TasksModule } from './tasks/tasks.module';
import { MembershipsModule } from './memberships/memberships.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TodoAppsModule, TasksModule, MembershipsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
