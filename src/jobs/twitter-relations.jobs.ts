import { Processor, Process } from '@nestjs/bull';
import axios from 'axios';
import { Job } from 'bull';
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
  @Process()
  async transcode(job: Job<TwitterRelationData>) {
    const { type } = job.data;
    if (type === 'FOLLOWERS') {
      return this.processFollowers(job.data);
    }
    return this.processFollowing(job.data);
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
          },
          bidirectional: false,
          properties: {
            kind: 'twitter',
          },
        },
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
          },
          bidirectional: false,
          properties: {
            kind: 'twitter',
          },
        },
      };
    });
    await this.sendRequests(relations, clientId);
  }

  private async sendRequests(relations: any[], clientId: string) {
    await Promise.all(
      relations.map(async (relation) => {
        try {
          const result = await axios.post(
            `${process.env.CORE_API_URL}/relationship`,
            relation,
            {
              headers: {
                'utu-trust-api-client-id': clientId,
              },
            },
          );
          return result;
        } catch (e) {
          console.log(e.message);
          return null;
        }
      }),
    );
  }
}
