import { Controller, Post, Body } from '@nestjs/common';
import { LoginsService } from './logins.service';
import { TwitterLoginDto } from './dto/twitter-login.dto';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter')
  create(@Body() twitterLoginDto: TwitterLoginDto) {
    return this.loginsService.twitter(twitterLoginDto);
  }
}
