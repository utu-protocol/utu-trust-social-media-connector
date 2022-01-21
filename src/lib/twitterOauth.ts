import { OAuth, OAuth2 } from 'oauth';

export type OathCredentials = {
  token: string;
  token_secret: string;
};
export default class TwitterOauth {
  static getOAuth(callbackUrl: string = null) {
    return new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET,
      '1.0',
      callbackUrl,
      'HMAC-SHA1',
    );
  }

  static getOAuth2() {
    return new OAuth2(
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET,
      'https://api.twitter.com/',
      null,
      'oauth2/token',
      null,
    );
  }

  static getRequestToken(callbackUrl) {
    const oa = this.getOAuth(callbackUrl);
    return new Promise((resolve, reject) => {
      oa.getOAuthRequestToken(
        (error, oAuthToken, oAuthTokenSecret, results) => {
          if (error) {
            return reject(error);
          }

          resolve({
            oAuthToken,
            oAuthTokenSecret,
            results,
          });
        },
      );
    });
  }

  static getAccessToken({ oauth_token, oauth_verifier, oauth_token_secret }) {
    const oa = this.getOAuth();
    console.log(
      'getting access token',
      oauth_token,
      oauth_verifier,
      oauth_token_secret,
    );
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

  static getBearerToken() {
    const oauth2 = this.getOAuth2();
    return new Promise((resolve, reject) => {
      oauth2.getOAuthAccessToken(
        '',
        { grant_type: 'client_credentials' },
        function (e, access_token, refresh_token, results) {
          if (e) return reject(e);
          resolve({
            access_token,
            refresh_token,
          });
        },
      );
    });
  }

  static get(
    { token, token_secret }: OathCredentials,
    url: string,
    params: any = {},
  ) {
    const oa = this.getOAuth();
    const validParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        validParams[key] = params[key];
      }
    });

    const searchParams = Object.keys(validParams).length
      ? `?${new URLSearchParams(validParams).toString()}`
      : '';

    return new Promise((resolve, reject) => {
      oa.get(
        `${url}${searchParams}`,
        token, //test user token
        token_secret, //test user secret
        (e, data) => {
          if (e) return reject(e);
          resolve(JSON.parse(data));
        },
      );
    });
  }

  static getUser({ token, token_secret }: OathCredentials) {
    const oa = this.getOAuth();
    return new Promise((resolve, reject) => {
      oa.get(
        'https://api.twitter.com/2/account/verify_credentials.json',
        token, //test user token
        token_secret, //test user secret
        (e, data) => {
          if (e) return reject(e);
          resolve(data);
        },
      );
    });
  }
}
