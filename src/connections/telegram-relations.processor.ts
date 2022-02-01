import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import TelegramAPI from '../lib/telegramAPI';

@Processor('telegram-relations')
export class telegramRelationConsumer {
  constructor(
    @InjectQueue('save-relationship')
    private saveTelegramRelationshipQueue: Queue,
  ) {}

  @Process({ concurrency: 50 })
  async transcode(job: Job<any>) {
    console.log('processing jobs');
    await this.processContacts(job.data);
    await job.progress(100);
    return true;
  }

  async processContacts({ address, id, connectionDto }) {
    const { userSession } = await TelegramAPI.verifyCode(connectionDto);
    const contacts: any = await TelegramAPI.getContacts(userSession);

    const telegramRelations = contacts.contacts.map((contact) => {
      // return contact;
      return {
        type: 'social',
        sourceCriteria: {
          type: 'Address',
          ids: {
            uuid: address,
            address: address,
            telegram: id,
          },
        },
        targetCriteria: {
          type: 'Address',
          ids: {
            twitter: contact.id,
          },
          bidirectional: false,
          properties: {
            kind: 'telegram',
          },
        },
      };
    });
    console.log(contacts);
    await this.sendRequests(telegramRelations, id);
  }

  private async sendRequests(relations: any[], clientId: string) {
    await Promise.all(
      relations.map(async (relation) => {
        await this.saveTelegramRelationshipQueue.add({
          relation,
          clientId,
        });
        return relation;
      }),
    );
  }
}
