import { Injectable } from '@nestjs/common';
import TwitterOauth from 'src/lib/twitterOauth';
import TelegramAPI from '../lib/telegramAPI';
import { TwitterLoginDto } from './dto/twitter-login.dto';

@Injectable()
export class LoginsService {
  async twitterRequestToken(twitterLoginDto: TwitterLoginDto) {
    return TwitterOauth.getRequestToken(twitterLoginDto.callback_url);
  }

  async telegramToken(tokenDto) {
    return await TelegramAPI.getLoginToken(tokenDto);
  }
}
