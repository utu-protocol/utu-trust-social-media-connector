import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import TwitterApi from 'src/lib/twitterAPI';
import { OathCredentials } from 'src/lib/twitterOauth';
import { processTwitterRelationships } from './social-media-relations.processor';

type TwitterRelationData = {
  credentials: OathCredentials;
  id: string;
  address: string;
  type: string;
  clientId: string;
};

@Processor('twitter-relations')
export class TwitterRelationConsumer {
  constructor(
    @InjectQueue('save-relationship') private saveRelationshipQueue: Queue,
  ) {}

  @Process({ concurrency: 50 })
  async transcode(job: Job<TwitterRelationData>) {
    const { type, credentials } = job.data;
    try {
      if (!credentials) return job.remove();
      if (type === 'FOLLOWERS') {
        await this.processFollowers(job.data);
        await job.progress(100);
        return true;
      }
      await this.processFollowing(job.data);
      await job.progress(100);
      return true;
    } catch (e) {
      console.log(e);
      await job.moveToFailed(e);
      return false;
    }
  }

  async processFollowers({
    credentials,
    id,
    address,
    clientId,
  }: TwitterRelationData) {
    const followers = await TwitterApi.getFollowers(credentials, id, 500);

    await processTwitterRelationships(
      id,
      address,
      clientId,
      followers,
      this.saveRelationshipQueue,
    );
  }

  async processFollowing({
    credentials,
    id,
    address,
    clientId,
  }: TwitterRelationData) {
    const followers = await TwitterApi.getFollowings(credentials, id, 500);

    await processTwitterRelationships(
      id,
      address,
      clientId,
      followers,
      this.saveRelationshipQueue,
    );
  }
}
