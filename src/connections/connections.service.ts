import { Injectable } from '@nestjs/common';

import { ConnectionDto } from './dto/connection.dto';
import Endorsement from 'src/lib/endorsement';

@Injectable()
export class ConnectionsService {
  async twitter(connectionDto: ConnectionDto) {
    const tx = await Endorsement.send(connectionDto.address, 10);
    return tx;
  }
}
