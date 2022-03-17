import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TwitterLoginDto } from './dto/twitter-login.dto';
import { LoginsService } from './logins.service';
import { TelegramTokenDto } from './dto/telegram-login.dto';

@Controller('logins')
export class LoginsController {
  constructor(private readonly loginsService: LoginsService) {}

  @Post('twitter/oauth/request_token')
  async create(@Body() twitterLoginDto: TwitterLoginDto) {
    try {
      const result = await this.loginsService.twitterRequestToken(
        twitterLoginDto,
      );
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        e.message,
        e.statusCode || e.code || HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  @Post('telegram/token')
  async telegram(@Body() tokenDto: TelegramTokenDto) {
    try {
      const result = await this.loginsService.telegramToken(tokenDto);
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        e.message,
        e.statusCode || e.code || HttpStatus.PRECONDITION_FAILED,
      );
    }
  }
}
