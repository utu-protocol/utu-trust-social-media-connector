import { Controller, Post, Body } from '@nestjs/common';
import { VerificationsService } from './verifications.service';
import { VerificationDto } from './dto/verification.dto';

@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @Post('twitter')
  create(@Body() verificationDto: VerificationDto) {
    return this.verificationsService.twitter(verificationDto);
  }
}
