import nodemailer from 'nodemailer';
import config from '../config/env';

export interface SendMailOptions {
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
}

const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port,
	secure: config.email.port === 465,
	auth: {
		user: config.email.username,
		pass: config.email.password,
	},
});

export async function sendMail(options: SendMailOptions): Promise<boolean> {
	try {
		await transporter.sendMail({
			from: config.email.from,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
		});
		return true;
	} catch (err) {
		console.error('Email send failed:', err);
		return false;
	}
}

export function renderAdminContactHtml(data: {
	name: string;
	email: string;
	phone: string;
	message: string;
	submittedAt: string;
}): string {
	return `
		<h2>New Contact Submission</h2>
		<p><strong>Name:</strong> ${data.name}</p>
		<p><strong>Email:</strong> ${data.email}</p>
		<p><strong>Phone:</strong> ${data.phone}</p>
		<p><strong>Submitted At:</strong> ${data.submittedAt}</p>
		<p><strong>Message:</strong></p>
		<p>${data.message.replace(/\n/g, '<br/>')}</p>
	`;
}



