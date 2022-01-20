import { Controller, Post } from '@nestjs/common';
import { LoginsService } from './logins.service';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter/oauth/request_token')
  create() {
    return this.loginsService.twitterRequestToken();
  }
}
