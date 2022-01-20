import {StringSession} from "telegram/sessions";
import {Api, TelegramClient} from "telegram";
import dotenv from "dotenv";
dotenv.config();

export default class TelegramAPI {
    private static api_id = process.env.TELEGRAM_API_ID;
    private static api_hash = process.env.TELEGRAM_API_HASH;

    private static instance = new StringSession("");

    static async getLoginToken({phone_number}) {
        try {
            const client = new TelegramClient(this.instance, Number(this.api_id), this.api_hash, {
                useWSS: true,
                connectionRetries: 5
            });

            await client.connect();

            const {phoneCodeHash}: any = await client.invoke(
                new Api.auth.SendCode({
                    phoneNumber: phone_number,
                    apiId: Number(this.api_id),
                    apiHash: this.api_hash,
                    settings: new Api.CodeSettings({
                        allowFlashcall: true,
                        currentNumber: true,
                        allowAppHash: true,
                    })
                })
            );

            client.session.save();

            return {
                message: "Code sent successfully, check your telegram app.",
                phoneCodeHash
            }
        } catch (err) {
            console.log("no 4", err)
            throw new Error(err)
        }
    }

    static async verifyCode({phone_number, phone_code_hash, phone_code}) {
        try {
            const client = new TelegramClient(this.instance, Number(this.api_id), this.api_hash, {
                useWSS: true,
                connectionRetries: 5
            });
            
            await client.connect();
            const {user}: any = await client.invoke(
                new Api.auth.SignIn({
                    phoneNumber: phone_number,
                    phoneCodeHash: phone_code_hash,
                    phoneCode: phone_code,
                })
            );

            let userSession = client.session.save()
            return {
                userSession,
                user,
                message: 'logged in successfully'
            }
        } catch (e) {
            throw new Error(e)
        }
    }

    static async getContacts(session: any) {
        try {
            const userSession = new StringSession(session);
            const client = new TelegramClient(userSession, Number(this.api_id), this.api_hash, {
                useWSS: true,
                connectionRetries: 5
            });
            await client.connect();
            return await client.invoke(new Api.contacts.GetContacts({}));
        } catch (e) {
            throw new Error(e)
        }
    }
}