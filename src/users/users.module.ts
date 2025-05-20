import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ make sure path is correct

@Module({
  imports: [PrismaModule],
  providers: [UsersService],
  exports: [UsersService], // ✅ export UsersService so other modules (like AuthModule) can use it
})
export class UsersModule {}
