import { Controller, Post, Body, Req } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import { Request } from 'express';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('twitter')
  twitter(
    @Body() connectionDto: TwitterConnectionDto,
    @Req() request: Request,
  ) {
    const clientId = String(request.headers['utu-trust-api-client-id']);
    return this.connectionsService.twitter(connectionDto, clientId);
  }

  @Post('telegram')
  telegram(
    @Body() connectionDto: TelegramConnectionDto,
    @Req() request: Request,
  ) {
    const telegramClientId = String(request.headers['utu-trust-api-client-id']);
    return this.connectionsService.telegram(connectionDto);
  }
}
