import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VerificationsModule } from './verifications/verifications.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [VerificationsModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
