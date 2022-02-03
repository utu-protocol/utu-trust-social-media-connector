import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import TelegramAPI from '../lib/telegramAPI';

@Processor('telegram-relations')
export class telegramRelationConsumer {
  constructor(
    @InjectQueue('save-telegram-relationship')
    private saveTelegramRelationshipQueue: Queue,
  ) {}

  @Process({ concurrency: 50 })
  async transcode(job: Job<any>) {
    console.log('processing jobs');
    await this.processContacts(job.data);
    await job.progress(100);
    return true;
  }

  async processContacts({ id, address, contacts, telegramClientId }) {
    console.log('processContacts');
    // console.log(contacts);

    const telegramRelations = contacts.map((contact) => {
      console.log(contact.id);
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
            telegram: contact.id,
          },
          bidirectional: false,
          properties: {
            kind: 'telegram',
          },
        },
      };
    });

    await this.sendRequests(telegramRelations, telegramClientId);
  }

  private async sendRequests(relations: any[], telegramClientId: string) {
    console.log('sendRequests');
    await Promise.all(
      relations.map(async (relation) => {
        await this.saveTelegramRelationshipQueue.add({
          relation,
          telegramClientId,
        });
        return relation;
      }),
    )
      .then((values) => {
        console.log('success');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
