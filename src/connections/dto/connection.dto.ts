import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class ConnectionDto {
  @ApiProperty({
    description: 'Ethereum style address',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'UTU Trust Client id',
  })
  @IsNotEmpty()
  @IsString()
  clientId: string;

  @ApiProperty({
    description: 'Twitter connection token',
  })
  @IsNotEmpty()
  @IsString()
  oauth_token: string;

  @IsNotEmpty()
  @IsString()
  oauth_token_secret: string;
}

export class TwitterConnectionDto {
  @ApiProperty({
    description: 'Ethereum style address',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Twitter connection token',
  })
  @IsNotEmpty()
  @IsString()
  oauth_token: string;

  @IsNotEmpty()
  @IsString()
  oauth_verifier: string;

  @IsNotEmpty()
  @IsString()
  oauth_token_secret: string;
}

export class TelegramConnectionDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  phone_code_hash: string;

  @IsNotEmpty()
  @IsNumberString()
  phone_code: string;

  // @IsNotEmpty()
  // @IsString()
  address: string;

  password: string;
}
