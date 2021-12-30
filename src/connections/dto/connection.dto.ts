import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
