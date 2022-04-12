import 'dotenv/config';

export const TWITTER_CONNECTION_TYPE_ID = 1;
export const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
export const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
export const TWITTER_REDIRECT_URL = process.env.TWITTER_REDIRECT_URL;

export const EXPECTED_PONG_BACK = 15000;
export const KEEP_ALIVE_CHECK_INTERVAL = 75000;

export const INFURA_WEBSOCKET = process.env.INFURA_WEBSOCKET;

// Either an ABI file or Etherscan api key + host must be provided:
export const CONTRACT_ABI_URL = process.env.CONTRACT_ABI_URL;
export const UTT_CONTRACT_ADDRESS = process.env.UTT_CONTRACT_ADDRESS;

export const UTT_PRIVATE_KEY = process.env.UTT_PRIVATE_KEY;
export const NODE_URL = process.env.NODE_URL;

export const TELEGRAM_CONNECTION_TYPE_ID = 2;
export const TELEGRAM_API_ID = Number(process.env.TELEGRAM_API_ID);
export const TELEGRAM_API_HASH = String(process.env.TELEGRAM_API_HASH);
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = String(process.env.REDIS_PORT || 6379);
