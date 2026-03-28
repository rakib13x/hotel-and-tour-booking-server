"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = exports.notificationEmailTemplates = exports.bookingEmailTemplates = exports.authEmailTemplates = exports.contactEmailTemplates = void 0;
// Contact Form Email Templates
exports.contactEmailTemplates = {
    adminNotification: {
        subject: '🔔 New Contact Form Submission from {{name}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
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
                    .message-field {
                        background-color: #e3f2fd;
                        border-left-color: #2196f3;
                    }
                    .footer {
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                        text-align: center;
                        color: #6c757d;
                        font-size: 12px;
                    }
                    .urgent {
                        background-color: #fff3cd;
                        border: 1px solid #ffeaa7;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 New Contact Form Submission</h1>
                        <p>You have received a new message from your website</p>
                    </div>
                    
                    <div class="urgent">
                        <strong>⏰ Action Required:</strong> A new contact form has been submitted and requires your attention.
                    </div>

                    <div class="field">
                        <div class="field-label">👤 Full Name:</div>
                        <div class="field-value">{{name}}</div>
                    </div>

                    <div class="field">
                        <div class="field-label">📧 Email Address:</div>
                        <div class="field-value">
                            <a href="mailto:{{email}}" style="color: #667eea; text-decoration: none;">
                                {{email}}
                            </a>
                        </div>
                    </div>

                    <div class="field">
                        <div class="field-label">📱 Phone Number:</div>
                        <div class="field-value">
                            <a href="tel:{{phone}}" style="color: #667eea; text-decoration: none;">
                                {{phone}}
                            </a>
                        </div>
                    </div>

                    <div class="field message-field">
                        <div class="field-label">💬 Message:</div>
                        <div class="field-value" style="white-space: pre-wrap; font-style: italic;">
                            "{{message}}"
                        </div>
                    </div>

                    <div class="field">
                        <div class="field-label">🕐 Submitted At:</div>
                        <div class="field-value">{{submittedAt}}</div>
                    </div>

                    <div class="footer">
                        <p>This is an automated notification from your contact form system.</p>
                        <p>Please respond to the customer within 24 hours for the best experience.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    },
    userConfirmation: {
        subject: '✅ Thank You for Contacting Us - We\'ve Received Your Message',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You for Contacting Us</title>
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
                        <h1>✅ Thank You for Contacting Us!</h1>
                        <p>We've received your message successfully</p>
                    </div>
                    
                    <div class="content">
                        <p>Dear <strong>{{name}}</strong>,</p>
                        
                        <p>Thank you for reaching out to us! We have successfully received your message and appreciate you taking the time to contact us.</p>
                        
                        <div class="highlight">
                            <strong>📋 Your Message Summary:</strong><br>
                            <em>"{{messagePreview}}"</em>
                        </div>
                        
                        <p><strong>What happens next?</strong></p>
                        <ul>
                            <li>Our team will review your message within 24 hours</li>
                            <li>We'll respond to your inquiry at <strong>{{email}}</strong></li>
                            <li>For urgent matters, you can also call us at <strong>{{phone}}</strong></li>
                        </ul>
                        
                        <p>We value your interest and look forward to assisting you!</p>
                        
                        <p>Best regards,<br>
                        <strong>The Support Team</strong></p>
                    </div>

                    <div class="footer">
                        <p>This is an automated confirmation email.</p>
                        <p>If you didn't submit this form, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    }
};
// User Authentication Email Templates
exports.authEmailTemplates = {
    welcome: {
        subject: '🎉 Welcome to {{appName}} - {{userName}}!',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to {{appName}}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                    .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎉 Welcome to {{appName}}!</h1>
                </div>
                <div class="content">
                    <p>Hi {{userName}},</p>
                    <p>Welcome to {{appName}}! We're excited to have you on board.</p>
                    <p>Your account has been successfully created with the email: <strong>{{email}}</strong></p>
                    <a href="{{loginUrl}}" class="button">Get Started</a>
                    <p>If you have any questions, feel free to contact our support team.</p>
                </div>
            </body>
            </html>
        `
    },
    passwordReset: {
        subject: '🔐 Password Reset Request for {{appName}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Password Reset</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                    .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                    .warning { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🔐 Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hi {{userName}},</p>
                    <p>We received a request to reset your password for your {{appName}} account.</p>
                    <a href="{{resetUrl}}" class="button">Reset Password</a>
                    <div class="warning">
                        <strong>⚠️ Important:</strong> This link will expire in {{expiryTime}}. If you didn't request this reset, please ignore this email.
                    </div>
                </div>
            </body>
            </html>
        `
    },
    emailVerification: {
        subject: '✅ Verify Your Email for {{appName}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Verify Your Email</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                    .button { display: inline-block; padding: 12px 24px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✅ Verify Your Email</h1>
                </div>
                <div class="content">
                    <p>Hi {{userName}},</p>
                    <p>Please verify your email address to complete your {{appName}} account setup.</p>
                    <a href="{{verificationUrl}}" class="button">Verify Email</a>
                    <p>Verification code: <strong>{{verificationCode}}</strong></p>
                </div>
            </body>
            </html>
        `
    }
};
// Booking/Order Email Templates
exports.bookingEmailTemplates = {
    bookingConfirmation: {
        subject: '🎫 Booking Confirmation - {{bookingId}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Booking Confirmation</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #17a2b8; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                    .booking-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎫 Booking Confirmed!</h1>
                </div>
                <div class="content">
                    <p>Hi {{customerName}},</p>
                    <p>Your booking has been confirmed!</p>
                    <div class="booking-details">
                        <h3>Booking Details:</h3>
                        <p><strong>Booking ID:</strong> {{bookingId}}</p>
                        <p><strong>Service:</strong> {{serviceName}}</p>
                        <p><strong>Date:</strong> {{bookingDate}}</p>
                        <p><strong>Amount:</strong> {{amount}}</p>
                    </div>
                </div>
            </body>
            </html>
        `
    },
    bookingCancellation: {
        subject: '❌ Booking Cancelled - {{bookingId}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Booking Cancelled</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc3545; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>❌ Booking Cancelled</h1>
                </div>
                <div class="content">
                    <p>Hi {{customerName}},</p>
                    <p>Your booking {{bookingId}} has been cancelled.</p>
                    <p><strong>Refund:</strong> {{refundAmount}} will be processed within {{refundDays}} business days.</p>
                </div>
            </body>
            </html>
        `
    }
};
// Notification Email Templates
exports.notificationEmailTemplates = {
    systemAlert: {
        subject: '🚨 System Alert - {{alertType}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>System Alert</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #ffc107; color: #212529; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                    .alert { background: #f8d7da; padding: 15px; border-radius: 5px; border-left: 4px solid #dc3545; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🚨 System Alert</h1>
                </div>
                <div class="content">
                    <div class="alert">
                        <h3>{{alertType}}</h3>
                        <p>{{alertMessage}}</p>
                        <p><strong>Time:</strong> {{timestamp}}</p>
                        <p><strong>Severity:</strong> {{severity}}</p>
                    </div>
                </div>
            </body>
            </html>
        `
    },
    newsletter: {
        subject: '📧 {{newsletterTitle}} - {{date}}',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Newsletter</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #6f42c1; color: white; padding: 20px; border-radius: 8px; text-align: center; }
                    .content { padding: 20px 0; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📧 {{newsletterTitle}}</h1>
                </div>
                <div class="content">
                    {{content}}
                </div>
            </body>
            </html>
        `
    }
};
// Export all templates
exports.emailTemplates = {
    contact: exports.contactEmailTemplates,
    auth: exports.authEmailTemplates,
    booking: exports.bookingEmailTemplates,
    notification: exports.notificationEmailTemplates
};
//# sourceMappingURL=emailTemplates.js.map