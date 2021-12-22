import { Injectable } from '@nestjs/common';
import { TwitterLoginDto } from './dto/twitter-login.dto';

@Injectable()
export class LoginsService {
  twitter(twitterLoginDto: TwitterLoginDto) {
    return 'This action adds a new login';
  }
}
