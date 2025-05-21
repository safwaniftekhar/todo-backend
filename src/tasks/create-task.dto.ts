import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class CreateTaskDto {
  @ApiProperty({ example: 'Fix login bug' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
