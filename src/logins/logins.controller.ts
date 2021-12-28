import { Controller, Post, Body } from '@nestjs/common';
import { LoginsService } from './logins.service';
import { TwitterLoginDto } from './dto/twitter-login.dto';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter/oauth/request_token')
  create() {
    return this.loginsService.twitterRequestToken();
  }

  @Post('twitter/oauth/access_token')
  createAccessToken(@Body() twitterLoginDto: TwitterLoginDto) {
    return this.loginsService.twitterAccessToken(twitterLoginDto);
  }
}
