import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from './connections/connections.module';
import { ConfigModule } from '@nestjs/config';
import { LoginsModule } from './logins/logins.module';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { TwitterRelationConsumer } from './jobs/twitter-relations.jobs';
@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ConnectionsModule,
    LoginsModule,
  ],
  controllers: [AppController],
  providers: [AppService, TwitterRelationConsumer],
})
export class AppModule {}
