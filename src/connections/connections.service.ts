import { Injectable } from '@nestjs/common';

import { ConnectionDto } from './dto/connection.dto';
import axios from 'axios';

@Injectable()
export class ConnectionsService {
  async twitter(connectionDto: ConnectionDto) {
    // const tx = await Endorsement.send(connectionDto.address, 10);
    // return tx;
    return this.createEntity(connectionDto);
  }

  async createEntity(connectionDto: ConnectionDto) {
    const twitterData = { username: 'twitterDev', id: 2933343, profile: 'url' };
    try {
      const result = await axios.post(
        `${process.env.CORE_API_URL}/entity`,
        {
          name: twitterData.username,
          type: 'Address',
          ids: {
            uuid: connectionDto.address,
            address: connectionDto.address,
            twitter: twitterData.id,
          },
          image: twitterData.profile,
          properties: {
            twitter_username: twitterData.username,
          },
        },
        {
          headers: {
            'UTU-Trust-Api-Client-Id': connectionDto.clientId,
          },
        },
      );
      return result;
    } catch (e) {
      console.log(e);
      return e.response?.data || e.message;
    }
  }
}
