import { Controller, Post, Body } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionDto } from './dto/connection.dto';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('twitter')
  create(@Body() connectionDto: ConnectionDto) {
    return this.connectionsService.twitter(connectionDto);
  }
}
