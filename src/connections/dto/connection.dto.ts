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
    description: 'Social connection token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
