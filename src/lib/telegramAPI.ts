import { StringSession } from 'telegram/sessions';
import { Api, TelegramClient } from 'telegram';
import { TELEGRAM_API_HASH, TELEGRAM_API_ID } from 'src/config';

let storedSession = null;

async function initClient(session?, save = false): Promise<TelegramClient> {
  const client = new TelegramClient(
    session || new StringSession(''),
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
  if (!storedSession && save) {
    storedSession = client.session.save();
  }
  return client;
}

export const getLoginToken = async ({ phone_number }) => {
  const client = await initClient(null, true);
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

  return {
    message: 'Code sent successfully, check your telegram app.',
    phoneCodeHash,
  };
};

export const verifyCode = async ({
  phone_number,
  phone_code_hash,
  phone_code,
}) => {
  const client = await initClient();
  const auth = (await client.invoke(
    new Api.auth.SignIn({
      phoneNumber: phone_number,
      phoneCodeHash: phone_code_hash,
      phoneCode: phone_code,
    }),
  )) as Api.auth.Authorization;
  const user = auth.user as Api.User;
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
