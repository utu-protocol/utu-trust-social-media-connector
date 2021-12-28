import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from './connections/connections.module';
import { ConfigModule } from '@nestjs/config';
import { LoginsModule } from './logins/logins.module';

@Module({
  imports: [ConfigModule.forRoot(), ConnectionsModule, LoginsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
