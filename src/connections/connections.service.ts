import { Injectable } from '@nestjs/common';
import { Api } from 'telegram';
import { BigInteger } from 'big-integer';
import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import axios from 'axios';
import TwitterOauth, { OathCredentials } from 'src/lib/twitterOauth';
import TwitterApi from 'src/lib/twitterAPI';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { verifyCode } from '../lib/telegramAPI';
import {
  TWITTER_CONNECTION_TYPE_ID,
  TELEGRAM_CONNECTION_TYPE_ID,
} from 'src/config';
import { addConnection } from 'src/lib/ethereum';

import bcrypt from 'bcrypt';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectQueue('twitter-relations') private twitterRelationsQueue: Queue,
    @InjectQueue('telegram-relations') private telegramRelationsQueue: Queue,
  ) {}

  async twitter(connectionDto: TwitterConnectionDto, clientId: string) {
    const data = (await TwitterOauth.getAccessToken(connectionDto)) as any;
    const twitterId = data.results.user_id;
    const credentials = {
      token: data.oauth_access_token,
      token_secret: data.oauth_access_token_secret,
    };
    const address = String(connectionDto.address).toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const HashedTwitterId = await bcrypt.hash(twitterId, salt);
    await this.createEntity(twitterId, address, clientId);
    await this.createRelations(credentials, twitterId, address, clientId);
    await addConnection(address, TWITTER_CONNECTION_TYPE_ID, HashedTwitterId);
    return data;
  }

  async createEntity(id: string, address: string, clientId: string) {
    const twitterData = await TwitterApi.getUser(id);
    return this.saveEntity(
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
          twitter: {
            name: twitterData.username,
            image: twitterData.profile_image_url,
          },
        },
      },
      clientId,
    );
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

  /*
   * telegram
   */
  async telegram(connectionDto: TelegramConnectionDto, telegramClientId) {
    const { userSession, user } = await verifyCode(connectionDto);
    const address = String(connectionDto.address).toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const HashedTelegramId = await bcrypt.hash(user.id, salt);
    await this.createTelegramEntity(user, address, telegramClientId);
    await this.createTelegramRelations(
      user.id,
      address,
      userSession,
      telegramClientId,
    );

    await addConnection(address, TELEGRAM_CONNECTION_TYPE_ID, HashedTelegramId);

    return {
      message: 'Linking data successful!',
    };
  }

  async createTelegramEntity(
    user: Api.User,
    address: string,
    clientId: string,
  ) {
    return this.saveEntity(
      {
        name: user.username,
        type: 'Address',
        ids: {
          uuid: address,
          address: address,
          telegram: Number(user.id),
        },
        // image: user.photo,
        properties: {
          name:
            user.username || `${user.firstName || ''}  ${user.lastName || ''}`,
          // image: if available, include TG profile image
        },
      },
      clientId,
    );
  }

  async createTelegramRelations(
    id: string | BigInteger,
    address: string,
    userSession: any,
    clientId: string,
  ) {
    console.log('createTelegramRelations');
    await this.telegramRelationsQueue.add({
      id,
      address,
      userSession,
      clientId,
    });
    return true;
  }

  async saveEntity(data: any, clientId: string) {
    try {
      const result = await axios.post(
        `${process.env.CORE_API_URL}/entity`,
        data,
        {
          headers: {
            'utu-trust-api-client-id': clientId,
          },
        },
      );
      console.log('saved');
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
