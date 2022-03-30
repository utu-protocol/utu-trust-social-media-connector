import axios from 'axios';
import { TWITTER_BEARER_TOKEN } from 'src/config';
import TwitterOauth, { OathCredentials } from './twitterOauth';

export default class TwitterApi {
  private static instance() {
    return axios.create({
      baseURL: 'https://api.twitter.com/2/',
      headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
    });
  }

  static async getUser(id: string) {
    const { data } = await this.instance().get(
      `users/${id}?user.fields=created_at,description,id,location,name,pinned_tweet_id,profile_image_url,protected,username,verified,withheld`,
    );
    return data.data;
  }

  static async getFollowers(
    credentials: OathCredentials,
    id: string,
    limit = 200,
    nextToken?: string,
  ): Promise<any> {
    const data = await TwitterOauth.get(
      credentials,
      `https://api.twitter.com/2/users/${id}/followers`,
      {
        max_results: limit,
        next_token: nextToken,
      },
    );
    return data;
  }

  static async getFollowings(
    credentials: OathCredentials,
    id: string,
    limit = 200,
    nextToken?: string,
  ): Promise<any> {
    const data = await TwitterOauth.get(
      credentials,
      `https://api.twitter.com/2/users/${id}/following`,
      {
        max_results: limit,
        next_token: nextToken,
      },
    );
    return data;
  }
}
