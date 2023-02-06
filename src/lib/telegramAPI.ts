import { StringSession } from 'telegram/sessions';
import { Api, TelegramClient } from 'telegram';
import { TELEGRAM_API_HASH, TELEGRAM_API_ID } from 'src/config';
import redisClient from './redis-client';
import MTProto from '@mtproto/core';
import path from 'path';

async function getSession(key): Promise<StringSession | null> {
  const session = await redisClient.get(key);
  if (session) {
    return new StringSession(session);
  }
  return null;
}

function getMtProto() {
  return new MTProto({
    api_id: TELEGRAM_API_ID,
    api_hash: TELEGRAM_API_HASH,
    storageOptions: {
      path: path.resolve(__dirname, './data/1.json'),
    },
  });
}

export async function initClient(
  session: StringSession | null = null,
): Promise<TelegramClient> {
  const currentSession = session || new StringSession('');
  await currentSession.load();

  const client = new TelegramClient(
    currentSession,
    TELEGRAM_API_ID,
    TELEGRAM_API_HASH,
    {
      useWSS: true,
      connectionRetries: 100000000000000000000000000,
      requestRetries: 5,
      floodSleepThreshold: 20,
      // autoReconnect: true,
    },
  );
  await client.connect();
  return client;
}

const saveSession = async (client, sessionId: string) => {
  const store = await client.session.save();
  await redisClient.set(sessionId, String(store));
};

export const getLoginToken = async ({ phone_number }) => {
  const client = await initClient();
  const { phoneCodeHash }: any = await client.invoke(
    new Api.auth.SendCode({
      phoneNumber: phone_number,
      apiId: TELEGRAM_API_ID,
      apiHash: TELEGRAM_API_HASH,
      settings: new Api.CodeSettings({
        allowFlashcall: true,
        currentNumber: true,
        allowAppHash: true,
      }),
    }),
  );

  await saveSession(client, phoneCodeHash);

  return {
    message: 'Code sent successfully, check your telegram app.',
    phoneCodeHash,
  };
};

const verifyCodeWithPassword = async (
  client: TelegramClient,
  { phone_number, phone_code, password },
) => {
  const { srpId, currentAlgo, srp_B } = await client.invoke(
    new Api.account.GetPassword(),
  );
  const { g, p, salt1, salt2 } =
    currentAlgo as Api.PasswordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow;

  const { A, M1 } = await getMtProto().crypto.getSRPParams({
    g,
    p,
    salt1,
    salt2,
    gB: srp_B,
    password,
  });

  const auth = (await client.invoke(
    new Api.auth.CheckPassword({
      password: new Api.InputCheckPasswordSRP({
        srpId,
        A: Buffer.from(A),
        M1: Buffer.from(M1),
      }),
    }),
  )) as Api.auth.Authorization;

  const user = auth.user as Api.User;
  return user as Api.User;
};

const verifyCodeWithOutPassword = async (
  client: TelegramClient,
  { phone_number, phone_code_hash, phone_code },
) => {
  const auth = (await client.invoke(
    new Api.auth.SignIn({
      phoneNumber: phone_number,
      phoneCodeHash: phone_code_hash,
      phoneCode: phone_code,
    }),
  )) as Api.auth.Authorization;
  const user = auth.user as Api.User;
  return user;
};

export const verifyCode = async ({
  phone_number,
  phone_code_hash,
  phone_code,
  password,
}) => {
  const session = await getSession(phone_code_hash);
  const client = await initClient(session);
  let user: Api.User;
  if (password) {
    user = await verifyCodeWithPassword(client, {
      phone_number,
      phone_code,
      password,
    });
  } else {
    user = await verifyCodeWithOutPassword(client, {
      phone_number,
      phone_code_hash,
      phone_code,
    });
  }
  const userSession = client.session.save();
  return {
    userSession,
    user,
    message: 'logged in successfully',
  };
};
export const getContacts = async (session: any) => {
  const userSession = new StringSession(session);
  const client = await initClient(userSession);
  return await client.invoke(new Api.contacts.GetContacts({}));
};
