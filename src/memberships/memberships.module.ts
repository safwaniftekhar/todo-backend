import { Module } from '@nestjs/common';
import { MembershipsController } from './memberships.controller';
import { MembershipsService } from './memberships.service';
import { PrismaModule } from '../prisma/prisma.module'; // 👈 update the path if needed

@Module({
  imports: [PrismaModule], // 👈 make PrismaService available
  controllers: [MembershipsController],
  providers: [MembershipsService],
})
export class MembershipsModule {}
