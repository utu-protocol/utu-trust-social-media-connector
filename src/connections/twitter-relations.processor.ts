import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import TwitterApi from 'src/lib/twitterAPI';
import { OathCredentials } from 'src/lib/twitterOauth';

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
    const relations = followers.data.map((follower) => {
      // return follower;
      return {
        type: 'social',
        sourceCriteria: {
          type: 'Address',
          ids: {
            twitter: follower.id,
          },
        },
        targetCriteria: {
          type: 'Address',
          ids: {
            uuid: address,
            address: address,
            twitter: id,
          }
        },
        bidirectional: false,
        properties: {
          kind: 'twitter',
        }
      };
    });
    await this.sendRequests(relations, clientId);
  }

  async processFollowing({
    credentials,
    id,
    address,
    clientId,
  }: TwitterRelationData) {
    const followers = await TwitterApi.getFollowings(credentials, id, 500);
    const relations = followers.data.map((follower) => {
      // return follower;
      return {
        type: 'social',
        sourceCriteria: {
          type: 'Address',
          ids: {
            uuid: address,
            address: address,
            twitter: id,
          },
        },
        targetCriteria: {
          type: 'Address',
          ids: {
            twitter: follower.id,
          }
        },
        bidirectional: false,
        properties: {
          kind: 'twitter',
        }
      };
    });
    await this.sendRequests(relations, clientId);
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
