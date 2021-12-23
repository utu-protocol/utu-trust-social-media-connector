import {Injectable} from '@nestjs/common';
import {TwitterLoginDto} from './dto/twitter-login.dto';
import {OAuth} from "oauth";

require('dotenv').config();
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const oauthCallback = process.env.FRONTEND_URL;

const oa = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    CONSUMER_KEY,
    CONSUMER_SECRET,
    '1.0',
    oauthCallback,
    'HMAC-SHA1'
);

@Injectable()
export class LoginsService {
    async twitterRequestToken() {
        return new Promise((resolve, reject) => {
            oa.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret, results) {
                if (error) {
                    reject({
                        message: 'Error occurred while getting access token',
                        error
                    });
                    return;
                }

                resolve({
                    oAuthToken,
                    oAuthTokenSecret,
                    results
                })
            });
        })

    }

    twitterAccessToken(twitterLoginDto: TwitterLoginDto){
        const {oauth_token, oauth_verifier, oauth_token_secret} = twitterLoginDto;
        return new Promise((resolve, reject) => {
            oa.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier, (error, oauth_access_token, oauth_access_token_secret, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve({oauth_access_token, oauth_access_token_secret, results});
                }
            });
        })
    }

}
