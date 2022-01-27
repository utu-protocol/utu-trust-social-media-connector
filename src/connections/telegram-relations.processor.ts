import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import TelegramAPI from '../lib/telegramAPI';

@Processor('telegram-relations')
export class telegramRelationConsumer {
  constructor(
    @InjectQueue('save-relationship') private saveRelationshipQueue: Queue,
  ) {}

  @Process({ concurrency: 50 })
  async transcode(job: Job<any>) {
    console.log('processing jobs');
    await this.processContacts(job.data);
    await job.progress(100);
    return true;
  }

  async processContacts({ connectionDto }) {
    const { userSession } = await TelegramAPI.verifyCode(connectionDto);
    const contacts = await TelegramAPI.getContacts(userSession);
    console.log(contacts);
  }
}
