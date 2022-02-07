import { IsNotEmpty, IsString } from 'class-validator';

export class TwitterLoginDto {
  @IsNotEmpty()
  @IsString()
  callback_url: string;
}
