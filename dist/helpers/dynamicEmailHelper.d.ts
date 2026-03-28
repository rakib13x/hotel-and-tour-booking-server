import nodemailer from "nodemailer";
export interface ISendEmail {
    to: string;
    subject: string;
    html: string;
}
export interface IEmailData {
    [key: string]: any;
}
export interface IEmailTemplate {
    subject: string;
    html: string;
}
export interface IEmailOptions {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    from?: string;
    replyTo?: string;
    attachments?: Array<{
        filename: string;
        content?: Buffer | string;
        path?: string;
        contentType?: string;
    }>;
}
export declare const dynamicEmailHelper: {
    sendEmail: (values: ISendEmail) => Promise<boolean>;
    sendEmailWithTemplate: (template: IEmailTemplate, emailOptions: IEmailOptions, data?: IEmailData) => Promise<boolean>;
    sendBulkEmails: (template: IEmailTemplate, recipients: Array<{
        email: string;
        data?: IEmailData;
        options?: Partial<IEmailOptions>;
    }>, globalData?: IEmailData) => Promise<{
        successful: number;
        failed: number;
        results: Array<{
            email: string;
            success: boolean;
            error?: string;
        }>;
    }>;
    sendAdminNotification: (notificationType: string, data: IEmailData, options?: Partial<IEmailOptions>) => Promise<boolean>;
    sendUserConfirmation: (userEmail: string, confirmationType: string, data: IEmailData, options?: Partial<IEmailOptions>) => Promise<boolean>;
    queueEmail: (template: IEmailTemplate, options: IEmailOptions, data?: IEmailData, maxRetries?: number) => void;
    transporter: nodemailer.Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo, import("nodemailer/lib/smtp-transport").Options>;
};
//# sourceMappingURL=dynamicEmailHelper.d.ts.map