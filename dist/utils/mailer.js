"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
exports.renderAdminContactHtml = renderAdminContactHtml;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = __importDefault(require("../config/env"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.default.email.host,
    port: env_1.default.email.port,
    secure: env_1.default.email.port === 465,
    auth: {
        user: env_1.default.email.username,
        pass: env_1.default.email.password,
    },
});
async function sendMail(options) {
    try {
        await transporter.sendMail({
            from: env_1.default.email.from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        });
        return true;
    }
    catch (err) {
        console.error('Email send failed:', err);
        return false;
    }
}
function renderAdminContactHtml(data) {
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
//# sourceMappingURL=mailer.js.map