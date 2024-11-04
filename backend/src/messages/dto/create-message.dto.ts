import { IsString, IsNotEmpty, IsISO8601 } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  channel: string;
}
