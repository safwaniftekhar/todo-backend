import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: Role, example: Role.VIEWER })
  @IsEnum(Role)
  role: Role;
}
