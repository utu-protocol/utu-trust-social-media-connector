import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from './connections/connections.module';
import { ConfigModule } from '@nestjs/config';
import { LoginsModule } from './logins/logins.module';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),
    ConnectionsModule,
    LoginsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
