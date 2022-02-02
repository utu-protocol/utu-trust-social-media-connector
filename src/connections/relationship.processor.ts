import { Processor, Process } from '@nestjs/bull';
import axios from 'axios';
import { Job } from 'bull';

type RelationshipData = {
  relation: any;
  clientId: string;
};

@Processor('save-relationship')
export class RelationshipConsumer {
  @Process({ concurrency: 100 })
  async transcode(job: Job<RelationshipData>) {
    const { relation, clientId } = job.data;
    console.log('running save job');
    await axios.post(`${process.env.CORE_API_URL}/relationship`, relation, {
      headers: {
        'utu-trust-api-client-id': clientId,
      },
    });
    console.log('saved');
    await job.progress(100);
    return true;
  }
}

@Processor('save-telegram-relationship')
export class telegramRelationshipConsumer {
  @Process({ concurrency: 100 })
  async transcode(job: Job<RelationshipData>) {
    const { relation, clientId } = job.data;
    console.log('running save job');
    await axios.post(`${process.env.CORE_API_URL}/relationship`, relation, {
      headers: {
        'utu-trust-api-client-id': clientId,
      },
    });
    console.log('saved');
    await job.progress(100);
    return true;
  }
}
