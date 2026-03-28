"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicEmailHelper = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../config/logger"));
const config_1 = __importDefault(require("../config"));
// Create reusable transporter object using SMTP transport
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.email.host,
    port: Number(config_1.default.email.port),
    secure: false,
    auth: {
        user: config_1.default.email.username,
        pass: config_1.default.email.password,
    },
});
// Generic email sender with template support
const sendEmailWithTemplate = async (template, emailOptions, data = {}) => {
    try {
        // Replace placeholders in subject and HTML with actual data
        let subject = template.subject;
        let html = template.html;
        // Replace all {{variableName}} placeholders with actual values
        Object.keys(data).forEach((key) => {
            const placeholder = new RegExp(`{{${key}}}`, "g");
            subject = subject.replace(placeholder, String(data[key] || ""));
            html = html.replace(placeholder, String(data[key] || ""));
        });
        const mailOptions = {
            from: emailOptions.from || `"MT Backend" ${config_1.default.email.from}`,
            to: Array.isArray(emailOptions.to)
                ? emailOptions.to.join(", ")
                : emailOptions.to,
            cc: emailOptions.cc
                ? Array.isArray(emailOptions.cc)
                    ? emailOptions.cc.join(", ")
                    : emailOptions.cc
                : undefined,
            bcc: emailOptions.bcc
                ? Array.isArray(emailOptions.bcc)
                    ? emailOptions.bcc.join(", ")
                    : emailOptions.bcc
                : undefined,
            replyTo: emailOptions.replyTo,
            subject,
            html,
            attachments: emailOptions.attachments,
        };
        const info = await transporter.sendMail(mailOptions);
        logger_1.default.info("Dynamic email sent successfully", {
            to: emailOptions.to,
            subject,
            messageId: info.messageId,
            accepted: info.accepted,
        });
        return true;
    }
    catch (error) {
        logger_1.default.error("Dynamic email sending failed:", error);
        return false;
    }
};
// Send simple email (existing functionality)
const sendEmail = async (values) => {
    try {
        const info = await transporter.sendMail({
            from: `"MT Backend" ${config_1.default.email.from}`,
            to: values.to,
            subject: values.subject,
            html: values.html,
        });
        logger_1.default.info("Simple email sent successfully", {
            to: values.to,
            subject: values.subject,
            accepted: info.accepted,
        });
        return true;
    }
    catch (error) {
        logger_1.default.error("Simple email sending failed:", error);
        return false;
    }
};
// Send bulk emails to multiple recipients
const sendBulkEmails = async (template, recipients, globalData = {}) => {
    const results = [];
    let successful = 0;
    let failed = 0;
    for (const recipient of recipients) {
        try {
            const mergedData = { ...globalData, ...recipient.data };
            const emailOptions = {
                to: recipient.email,
                ...recipient.options,
            };
            const success = await sendEmailWithTemplate(template, emailOptions, mergedData);
            if (success) {
                successful++;
                results.push({ email: recipient.email, success: true });
            }
            else {
                failed++;
                results.push({
                    email: recipient.email,
                    success: false,
                    error: "Email sending failed",
                });
            }
        }
        catch (error) {
            failed++;
            results.push({
                email: recipient.email,
                success: false,
                error: error.message || "Unknown error",
            });
        }
    }
    logger_1.default.info("Bulk email sending completed", {
        successful,
        failed,
        total: recipients.length,
    });
    return { successful, failed, results };
};
// Send notification to admin with dynamic content
const sendAdminNotification = async (notificationType, data, options = {}) => {
    try {
        const adminEmail = config_1.default.admin.email;
        if (!adminEmail) {
            logger_1.default.error("Admin email not configured");
            return false;
        }
        // Default admin notification template
        const template = {
            subject: `🔔 {{notificationType}} - {{title}}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Admin Notification</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .field {
                            margin-bottom: 15px;
                            padding: 15px;
                            background-color: #f8f9fa;
                            border-radius: 5px;
                            border-left: 4px solid #667eea;
                        }
                        .field-label {
                            font-weight: bold;
                            color: #495057;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            color: #6c757d;
                        }
                        .footer {
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🔔 {{notificationType}}</h1>
                            <p>{{description}}</p>
                        </div>
                        
                        {{#if urgent}}
                        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                            <strong>⏰ Action Required:</strong> {{urgent}}
                        </div>
                        {{/if}}

                        {{content}}

                        <div class="footer">
                            <p>This is an automated notification from your system.</p>
                            <p>Timestamp: {{timestamp}}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };
        const emailData = {
            notificationType,
            timestamp: new Date().toLocaleString(),
            ...data,
        };
        const emailOptions = {
            to: adminEmail,
            ...options,
        };
        return await sendEmailWithTemplate(template, emailOptions, emailData);
    }
    catch (error) {
        logger_1.default.error("Failed to send admin notification:", error);
        return false;
    }
};
// Send user confirmation with dynamic content
const sendUserConfirmation = async (userEmail, confirmationType, data, options = {}) => {
    try {
        // Default user confirmation template
        const template = {
            subject: `✅ {{confirmationType}} - {{title}}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmation</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f4f4f4;
                        }
                        .container {
                            background: white;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .content {
                            margin-bottom: 20px;
                        }
                        .highlight {
                            background-color: #d4edda;
                            padding: 15px;
                            border-radius: 5px;
                            border-left: 4px solid #28a745;
                            margin: 20px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            text-align: center;
                            color: #6c757d;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✅ {{confirmationType}}</h1>
                            <p>{{description}}</p>
                        </div>
                        
                        <div class="content">
                            {{content}}
                        </div>

                        <div class="footer">
                            <p>This is an automated confirmation email.</p>
                            <p>If you didn't perform this action, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };
        const emailData = {
            confirmationType,
            timestamp: new Date().toLocaleString(),
            ...data,
        };
        const emailOptions = {
            to: userEmail,
            ...options,
        };
        return await sendEmailWithTemplate(template, emailOptions, emailData);
    }
    catch (error) {
        logger_1.default.error("Failed to send user confirmation:", error);
        return false;
    }
};
class EmailQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }
    add(item) {
        item.retries = 0;
        item.maxRetries = item.maxRetries || 3;
        this.queue.push(item);
        this.process();
    }
    async process() {
        if (this.processing || this.queue.length === 0)
            return;
        this.processing = true;
        while (this.queue.length > 0) {
            const item = this.queue.shift();
            try {
                const success = await sendEmailWithTemplate(item.template, item.options, item.data);
                if (!success && item.retries < item.maxRetries) {
                    item.retries++;
                    this.queue.push(item);
                    logger_1.default.warn(`Email retry ${item.retries}/${item.maxRetries} for ${item.options.to}`);
                }
            }
            catch (error) {
                if (item.retries < item.maxRetries) {
                    item.retries++;
                    this.queue.push(item);
                }
                else {
                    logger_1.default.error("Email failed after max retries:", error);
                }
            }
        }
        this.processing = false;
    }
}
const emailQueue = new EmailQueue();
// Add email to queue for background processing
const queueEmail = (template, options, data = {}, maxRetries = 3) => {
    emailQueue.add({ template, options, data, maxRetries });
};
exports.dynamicEmailHelper = {
    // Core functions
    sendEmail,
    sendEmailWithTemplate,
    sendBulkEmails,
    // Convenience functions
    sendAdminNotification,
    sendUserConfirmation,
    // Queue functions
    queueEmail,
    // Utility
    transporter,
};
//# sourceMappingURL=dynamicEmailHelper.js.map