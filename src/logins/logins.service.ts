import { Injectable } from '@nestjs/common';
import TwitterOauth from 'src/lib/twitterOauth';
import TelegramAPI from '../lib/telegramAPI';

@Injectable()
export class LoginsService {
  async twitterRequestToken() {
    return TwitterOauth.getRequestToken();
  }

  async telegramToken(tokenDto) {
    return await TelegramAPI.getLoginToken(tokenDto);
  }
}
