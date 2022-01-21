import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import {
  TelegramConnectionDto,
  TwitterConnectionDto,
} from './dto/connection.dto';
import { Request, Response } from 'express';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('twitter')
  async twitter(
    @Body() connectionDto: TwitterConnectionDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const clientId = String(request.headers['utu-trust-api-client-id']);
    try {
      const result = await this.connectionsService.twitter(
        connectionDto,
        clientId,
      );
      res.send(result);
    } catch (e) {
      res.status(e.statusCode).send(e);
    }
  }

  @Post('telegram')
  telegram(
    @Body() connectionDto: TelegramConnectionDto,
    @Req() request: Request,
  ) {
    const clientId = String(request.headers['utu-trust-api-client-id']);
    return this.connectionsService.twitter(connectionDto, clientId);
  }
}
