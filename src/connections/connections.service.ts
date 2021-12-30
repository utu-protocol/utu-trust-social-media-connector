import { Injectable } from '@nestjs/common';

import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import axios from 'axios';
import TwitterOauth from 'src/lib/twitterOauth';
import TwitterApi from 'src/lib/twitterAPI';

@Injectable()
export class ConnectionsService {
  async twitter(connectionDto: TwitterConnectionDto) {
    // const tx = await Endorsement.send(connectionDto.address, 10);
    // return tx;
    const data = (await TwitterOauth.getAccessToken(connectionDto)) as any;
    const twitterId = data.results.user_id;
    // await this.createEntity(twitterId, connectionDto.address);
    await this.createRelations(twitterId, connectionDto.address);
    return true;
  }

  async telegram(connectionDto: TelegramConnectionDto) {
    return true;
  }

  async createEntity(id: string, address: string) {
    const twitterData = await TwitterApi.getUser(id);
    try {
      const result = await axios.post(
        `${process.env.CORE_API_URL}/entity`,
        {
          name: twitterData.username,
          type: 'Address',
          ids: {
            uuid: address,
            address: address,
            twitter: twitterData.id,
          },
          image: twitterData.profile_image_url,
          properties: {
            twitter_username: twitterData.username,
          },
        },
        {
          headers: {
            'UTU-Trust-Api-Client-Id': '4YcU3qARJbMSg7Ma5i3a0e',
          },
        },
      );
      return result;
    } catch (e) {
      console.log(e);
      return e.response?.data || e.message;
    }
  }

  async createRelations(id: string, address: string) {
    const followers = await TwitterApi.getFollowers(id);
    // console.log(followers);
    const following = await TwitterApi.getFollowings(id);
    console.log(following);
  }
}
