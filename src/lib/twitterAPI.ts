import axios from 'axios';

export default class TwitterApi {
  private static instance() {
    return axios.create({
      baseURL: 'https://api.twitter.com/2/',
      headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
    });
  }

  static async getUser(id: string) {
    const { data } = await this.instance().get(
      `users/${id}?user.fields=created_at,description,id,location,name,pinned_tweet_id,profile_image_url,protected,username,verified,withheld`,
    );
    return data.data;
  }

  static async getFollowers(id: string, limit = 200, nextToken?: string) {
    const { data } = await this.instance().get(`users/${id}/followers`, {
      params: {
        max_results: limit,
        next_token: nextToken,
      },
    });
    return data;
  }

  static async getFollowings(id: string, limit = 200, nextToken?: string) {
    const { data } = await this.instance().get(`users/${id}/following`, {
      params: {
        max_results: limit,
        next_token: nextToken,
      },
    });
    return data;
  }
}
