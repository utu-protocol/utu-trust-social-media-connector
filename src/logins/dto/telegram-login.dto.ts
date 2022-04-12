import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class TelegramLoginDto {}

export class TelegramTokenDto {
  @ApiProperty({
    description: 'Telegram user phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;
}
