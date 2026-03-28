export interface SendMailOptions {
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
}
export declare function sendMail(options: SendMailOptions): Promise<boolean>;
export declare function renderAdminContactHtml(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
    submittedAt: string;
}): string;
//# sourceMappingURL=mailer.d.ts.map