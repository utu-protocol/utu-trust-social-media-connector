import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { getContacts } from '../lib/telegramAPI';
import { processTelegramRelationships } from './social-media-relations.processor';

@Processor('telegram-relations')
export class telegramRelationConsumer {
  constructor(
    @InjectQueue('save-relationship') private saveRelationshipQueue: Queue,
  ) {}

  @Process({ concurrency: 50 })
  async transcode(job: Job<any>) {
    console.log('processing jobs');
    try {
      await this.processContacts(job.data);
      await job.progress(100);
      return true;
    } catch (e) {
      console.log(e);
      await job.moveToFailed(e);
      return false;
    }
  }

  async processContacts({ id, address, userSession, clientId }) {
    console.log('processContacts');
    const contacts: any = await getContacts(userSession);

    await processTelegramRelationships(
      id,
      address,
      clientId,
      contacts,
      this.saveRelationshipQueue,
    );
  }
}
