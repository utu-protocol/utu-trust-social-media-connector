import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { BullModule } from '@nestjs/bull';
import { RelationshipConsumer } from './relationship.processor';
import { TwitterRelationConsumer } from './twitter-relations.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'twitter-relations',
      },
      {
        name: 'save-relationship',
      },
    ),
  ],
  controllers: [ConnectionsController],
  providers: [
    ConnectionsService,
    TwitterRelationConsumer,
    RelationshipConsumer,
  ],
})
export class ConnectionsModule {}
