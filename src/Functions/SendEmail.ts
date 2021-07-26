import nodemailer from "nodemailer";
import * as Config from "../Config";

export function SendEmail(receivingAddress: string, subject: string, message: string) {
	const hostname = Config.GetHost();
	const username = Config.GetConfigEmail();
	const clientId = Config.GetClientId();
	const clientSecret = Config.GetClientSecret();
	const refreshToken = Config.GetRefreshToken();
	const accessToken = Config.GetAccessToken();

	const transporter = nodemailer.createTransport({
		host: hostname,
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: username,
			clientId: clientId,
			clientSecret: clientSecret,
			refreshToken: refreshToken,
			accessToken: accessToken
		}
	});

	const mailOptions = { from: '"Business Card Emailer" <' + username + '>',
		to: receivingAddress,
		subject: subject,
		text: message
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info);
		}
	});
}
