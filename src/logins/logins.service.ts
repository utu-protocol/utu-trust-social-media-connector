import { Injectable } from '@nestjs/common';
import TwitterOauth from 'src/lib/twitterOauth';
import { TwitterLoginDto } from './dto/twitter-login.dto';

@Injectable()
export class LoginsService {
  async twitterRequestToken(twitterLoginDto: TwitterLoginDto) {
    return TwitterOauth.getRequestToken(twitterLoginDto.callback_url);
  }
}
