import { Injectable } from '@nestjs/common';
import TwitterOauth from 'src/lib/twitterOauth';

@Injectable()
export class LoginsService {
  async twitterRequestToken() {
    return TwitterOauth.getRequestToken();
  }
}
