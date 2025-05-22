import { IsOptional, IsString, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '2025-06-01T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ description: '1 = High, 2 = Medium, 3 = Low' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  priority?: number;
}
