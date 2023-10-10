import { Injectable } from '@nestjs/common';
import { generate, generateSecret, verify } from '2fa-util';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class TwoFaService {
	private unconfirmed_secrets: Map<number, string> = new Map<number, string>();

	constructor(private readonly pservice: PlayersService) {}

	async verifyOTP(userID: number, otp: string): Promise<boolean> {
		let secret: string;

		console.log('verifyOTP arg userID is');
		console.log(userID);
		console.log('verifyOTP arg otp is');
		console.log(otp);
		if (this.unconfirmed_secrets.has(userID)) {
			console.log('secret is HIHIunconfirmed');
			console.log('secret is ');
			secret = this.unconfirmed_secrets.get(userID);
			console.log(secret);
			console.log('expected TOTP is: ');
			const expectedOTP = generate(secret);
			console.log(expectedOTP);
			console.log(typeof otp);
			console.log(typeof expectedOTP);
			if (expectedOTP === otp) console.log('TOTP matches expected');
			if (true === (await verify(otp, secret))) {
				this.pservice.update(userID, { twofaSecret: secret });
				this.unconfirmed_secrets.delete(userID);
				return true;
			}
			return false;
		} else {
			console.log('secret is not unconfirmed');
			secret = (await this.pservice.findOne(userID)).twofaSecret;
			if (secret && (await verify(otp, secret))) {
				return true;
			}
			return false;
		}
	}

	async generate2FAQRCode(userID: number): Promise<string> {
		const { qrcode, secret } = await generateSecret(
			String(userID),
			process.env.APP_NAME,
		);
		console.log('generated secret is');
		console.log(secret);
		this.unconfirmed_secrets.set(userID, secret);
		return qrcode;
	}
}
