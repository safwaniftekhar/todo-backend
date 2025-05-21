import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoAppDto {
  @ApiProperty({ example: 'Work Tasks' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
