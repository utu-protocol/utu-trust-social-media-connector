import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { getContacts } from '../lib/telegramAPI';

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

    const telegramRelations = contacts.users.map((contact) => {
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
          }
        },
        bidirectional: false,
        properties: {
          kind: 'telegram',
        }
      };
    });

    await this.sendRequests(telegramRelations, clientId);
  }

  private async sendRequests(relations: any[], clientId: string) {
    await Promise.all(
      relations.map(async (relation) => {
        await this.saveRelationshipQueue.add({
          relation,
          clientId,
        });
        return relation;
      }),
    );
  }
}
