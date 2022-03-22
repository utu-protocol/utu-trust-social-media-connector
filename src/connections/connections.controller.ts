import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
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
    console.log('connecting to twitter');
    try {
      const result = await this.connectionsService.twitter(
        connectionDto,
        clientId,
      );
      res.send(result);
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.PRECONDITION_FAILED);
    }
  }

  @Post('telegram')
  async telegram(
    @Body() connectionDto: TelegramConnectionDto,
    @Req() request: Request,
  ) {
    try {
      const telegramClientId = String(
        request.headers['utu-trust-api-client-id'],
      );
      const result = await this.connectionsService.telegram(
        connectionDto,
        telegramClientId,
      );
      return result;
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.PRECONDITION_FAILED);
    }
  }
}
