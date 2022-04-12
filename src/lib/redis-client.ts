import { createClient, RedisClientType } from 'redis';
import { REDIS_HOST, REDIS_PORT } from 'src/config';

const redisClient: RedisClientType = createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.connect();

export default redisClient;
