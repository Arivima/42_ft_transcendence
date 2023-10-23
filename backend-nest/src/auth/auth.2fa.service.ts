import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { generateSecret, verify } from '2fa-util';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class TwoFaService {
	private unconfirmed_secrets: Map<number, string> = new Map<number, string>();

	constructor(private readonly pservice: PlayersService) {}

	async verifyOTP(userID: number, otp: string): Promise<boolean> {
		let secret: string;

		if (this.unconfirmed_secrets.has(userID)) {
			secret = this.unconfirmed_secrets.get(userID);
			if (true === (await verify(otp, secret))) {
				this.pservice.update(userID, { twofaSecret: secret });
				this.unconfirmed_secrets.delete(userID);
				return true;
			}
			return false;
		} else {
			secret = (await this.pservice.findOne(userID)).twofaSecret;
			if (secret && (await verify(otp, secret))) {
				return true;
			}
			return false;
		}
	}

	async removeOTP(userID: number, otp: string): Promise<boolean> {
		if (await this.verifyOTP(userID, otp)) {
			if (null == await this.pservice.update(userID, {
							twofaSecret: null
						})
			)
				throw new InternalServerErrorException("db failed operation");
			return true;
		}
		return false;
	}


	async generate2FAQRCode(userID: number): Promise<string> {
		const { qrcode, secret } = await generateSecret(
			String(userID),
			process.env.APP_NAME,
		);
		this.unconfirmed_secrets.set(userID, secret);
		return qrcode;
	}
}
