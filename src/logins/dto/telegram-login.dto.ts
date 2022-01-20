import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString} from "class-validator";

export class TelegramLoginDto {

}

export class TelegramTokenDto {
    @ApiProperty({
        description: 'Telegram user phone number',
    })
    @IsNotEmpty()
    @IsString()
    phone_number: string;
}