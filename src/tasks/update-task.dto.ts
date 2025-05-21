import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Update dashboard layout' })
  @IsString()
  title: string;
}
