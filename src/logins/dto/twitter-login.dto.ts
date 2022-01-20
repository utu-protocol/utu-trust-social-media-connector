import { IsNotEmpty, IsString } from 'class-validator';

export class TwitterLoginDto {
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
