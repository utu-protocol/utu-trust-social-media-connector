import { Injectable } from '@nestjs/common';

import { VerificationDto } from './dto/verification.dto';
import Endorsement from 'src/lib/endorsement';

@Injectable()
export class VerificationsService {
  async twitter(verificationDto: VerificationDto) {
    const tx = await Endorsement.send(verificationDto.address, 10);
    return tx;
  }
}
