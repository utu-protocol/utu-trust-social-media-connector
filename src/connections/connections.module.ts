import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { BullModule } from '@nestjs/bull';
import { RelationshipConsumer } from './relationship.processor';
import { TwitterRelationConsumer } from './twitter-relations.processor';
import { telegramRelationConsumer } from './telegram-relations.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'twitter-relations',
      },
      {
        name: 'save-relationship',
      },
      {
        name: 'telegram-relations',
      },
    ),
  ],
  controllers: [ConnectionsController],
  providers: [
    ConnectionsService,
    TwitterRelationConsumer,
    telegramRelationConsumer,
    RelationshipConsumer,
  ],
})
export class ConnectionsModule {}
