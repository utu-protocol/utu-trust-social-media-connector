import { Injectable } from '@nestjs/common';

import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import axios from 'axios';
import TwitterOauth from 'src/lib/twitterOauth';
import TwitterApi from 'src/lib/twitterAPI';
import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';

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
    const apiId = 9280354;
    const apiHash = 'd811a6ea6ec6324f7c4f665c573cbd9c';

    console.log(`+++++   ${connectionDto.oauth_token}`);
    const stringSession = new StringSession(connectionDto.oauth_token);
    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    stringSession.save(); // Save this string to avoid logging in again
    await client.connect();
    console.log('You should now be connected.');

    const result = await client.invoke(new Api.contacts.GetContacts({}));
    console.log(result); // prints the result
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
