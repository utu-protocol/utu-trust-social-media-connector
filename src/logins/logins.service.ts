import { Injectable } from '@nestjs/common';
import { TwitterLoginDto } from './dto/twitter-login.dto';
import { OAuth } from 'oauth';

@Injectable()
export class LoginsService {
  private getOAuth() {
    return new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET,
      '1.0',
      process.env.FRONTEND_URL,
      'HMAC-SHA1',
    );
  }
  async twitterRequestToken() {
    return new Promise((resolve, reject) => {
      const oa = this.getOAuth();
      oa.getOAuthRequestToken(function (
        error,
        oAuthToken,
        oAuthTokenSecret,
        results,
      ) {
        console.log(error);
        if (error) {
          reject({
            message: 'Error occurred while getting access token',
            error,
          });
          return;
        }

        resolve({
          oAuthToken,
          oAuthTokenSecret,
          results,
        });
      });
    });
  }

  twitterAccessToken(twitterLoginDto: TwitterLoginDto) {
    const { oauth_token, oauth_verifier, oauth_token_secret } = twitterLoginDto;
    const oa = this.getOAuth();
    return new Promise((resolve, reject) => {
      oa.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        (error, oauth_access_token, oauth_access_token_secret, results) => {
          if (error) {
            reject(error);
          } else {
            resolve({ oauth_access_token, oauth_access_token_secret, results });
          }
        },
      );
    });
  }
}
