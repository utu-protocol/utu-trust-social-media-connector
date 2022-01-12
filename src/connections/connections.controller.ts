import { Controller, Post, Body } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('twitter')
  twitter(@Body() connectionDto: TwitterConnectionDto) {
    return this.connectionsService.twitter(connectionDto);
  }

  @Post('telegram')
  telegram(@Body() connectionDto: TelegramConnectionDto) {
    return this.connectionsService.telegram(connectionDto);
  }
}
