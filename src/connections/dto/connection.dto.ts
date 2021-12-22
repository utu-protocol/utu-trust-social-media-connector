import { IsNotEmpty, IsString } from 'class-validator';

export class ConnectionDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  clientId: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
