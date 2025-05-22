import { Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { PrismaModule } from '../prisma/prisma.module'; 
import { NotificationsModule } from '../notifications.module'; 

@Module({
  imports: [PrismaModule, NotificationsModule], 
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
