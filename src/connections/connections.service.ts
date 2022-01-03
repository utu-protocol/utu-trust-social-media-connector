import { Injectable } from '@nestjs/common';

import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import axios from 'axios';
import TwitterOauth, { OathCredentials } from 'src/lib/twitterOauth';
import TwitterApi from 'src/lib/twitterAPI';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectQueue('twitter-relations') private twitterRelationsQueue: Queue,
  ) {}

  async twitter(connectionDto: TwitterConnectionDto, clientId: string) {
    // const tx = await Endorsement.send(connectionDto.address, 10);
    // return tx;
    const data = (await TwitterOauth.getAccessToken(connectionDto)) as any;
    const twitterId = data.results.user_id;
    const credentials = {
      token: data.oauth_access_token,
      token_secret: data.oauth_access_token_secret,
    };
    const entity = await this.createEntity(
      twitterId,
      connectionDto.address,
      clientId,
    );
    await this.createRelations(
      credentials,
      twitterId,
      connectionDto.address,
      clientId,
    );
    return entity;
  }

  async telegram(connectionDto: TelegramConnectionDto, clientId: string) {
    return true;
  }

  async createEntity(id: string, address: string, clientId: string) {
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
            'UTU-Trust-Api-Client-Id': clientId,
          },
        },
      );
      return result;
    } catch (e) {
      console.log(e);
      return e.response?.data || e.message;
    }
  }

  async createRelations(
    credentials: OathCredentials,
    id: string,
    address: string,
    clientId: string,
  ) {
    await this.twitterRelationsQueue.add({
      credentials,
      id,
      address,
      type: 'FOLLOWERS',
      clientId,
    });

    await this.twitterRelationsQueue.add({
      credentials,
      id,
      address,
      type: 'FOLLOWING',
      clientId,
    });
    return true;
  }
}
