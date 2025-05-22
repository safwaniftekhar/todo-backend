import { Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 update the path if needed
import { NotificationsModule } from '../notifications.module'; // 👈 import

@Module({
  imports: [PrismaModule, NotificationsModule], // 👈 make PrismaService available
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
