import {Body, Controller, Post} from '@nestjs/common';
import { LoginsService } from './logins.service';
import {TelegramTokenDto} from "./dto/telegram-login.dto";

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter/oauth/request_token')
  create() {
    return this.loginsService.twitterRequestToken();
  }

  @Post('telegram/token')
  telegram(@Body() tokenDto: TelegramTokenDto ) {
    return this.loginsService.telegramToken(tokenDto);
  }
}
