import { Body, Controller, Post } from '@nestjs/common';
import { TwitterLoginDto } from './dto/twitter-login.dto';
import { LoginsService } from './logins.service';
import { TelegramTokenDto } from './dto/telegram-login.dto';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter/oauth/request_token')
  create(@Body() twitterLoginDto: TwitterLoginDto) {
    return this.loginsService.twitterRequestToken(twitterLoginDto);
  }

  @Post('telegram/token')
  telegram(@Body() tokenDto: TelegramTokenDto) {
    return this.loginsService.telegramToken(tokenDto);
  }
}
