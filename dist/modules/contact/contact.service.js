"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const contact_model_1 = require("../../models/contact.model");
const dynamicEmailHelper_1 = require("../../helpers/dynamicEmailHelper");
const emailTemplates_1 = require("../../helpers/emailTemplates");
const logger_1 = __importDefault(require("../../config/logger"));
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = __importDefault(require("../../config/env"));
// Create contact and send emails
const sendMailAndSaveContact = async (contactData) => {
    try {
        // First, save the contact data to database
        const savedContact = await contact_model_1.Contact.create(contactData);
        logger_1.default.info('Contact saved to database successfully', { contactId: savedContact._id });
        // Prepare email data
        const emailData = {
            name: contactData.name,
            email: contactData.email,
            phone: contactData.phone,
            message: contactData.message,
            submittedAt: (savedContact.createdAt || new Date()).toLocaleString(),
            messagePreview: contactData.message.length > 100
                ? contactData.message.substring(0, 100) + '...'
                : contactData.message
        };
        // Send notification email to admin (fire and forget - don't block the response)
        dynamicEmailHelper_1.dynamicEmailHelper.sendEmailWithTemplate(emailTemplates_1.emailTemplates.contact.adminNotification, { to: env_1.default.admin.email || 'admin@example.com' }, emailData).then((success) => {
            if (success) {
                logger_1.default.info('Admin notification email sent successfully');
            }
            else {
                logger_1.default.warn('Failed to send admin notification email');
            }
        }).catch((error) => {
            logger_1.default.error('Error sending admin notification:', error);
        });
        // Send confirmation email to user (fire and forget - don't block the response)
        // dynamicEmailHelper.sendEmailWithTemplate(
        //     emailTemplates.contact.userConfirmation,
        //     { to: contactData.email },
        //     emailData
        // ).then((success) => {
        //     if (success) {
        //         logger.info('User confirmation email sent successfully');
        //     } else {
        //         logger.warn('Failed to send user confirmation email');
        //     }
        // }).catch((error) => {
        //     errorLogger.error('Error sending user confirmation:', error);
        // });
        return savedContact;
    }
    catch (error) {
        logger_1.default.error('Error in sendMailAndSaveContact:', error);
        if (error.name === 'ValidationError') {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Validation failed: ' + error.message);
        }
        if (error.code === 11000) {
            throw new ApiError_1.default(http_status_codes_1.default.CONFLICT, 'Duplicate entry detected');
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to process contact form submission');
    }
};
// Get all contacts with pagination and sorting
const getAllContacts = async (page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search) => {
    try {
        // Validate pagination parameters
        const pageNumber = Math.max(1, page);
        const limitNumber = Math.max(1, Math.min(100, limit)); // Max 100 items per page
        const skip = (pageNumber - 1) * limitNumber;
        // Build search query
        let searchQuery = {};
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            searchQuery = {
                $or: [
                    { name: { $regex: searchRegex } },
                    { email: { $regex: searchRegex } },
                    { phone: { $regex: searchRegex } },
                    { message: { $regex: searchRegex } }
                ]
            };
        }
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Execute queries in parallel
        const [contacts, totalContacts] = await Promise.all([
            contact_model_1.Contact.find(searchQuery)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            contact_model_1.Contact.countDocuments(searchQuery)
        ]);
        // Calculate pagination info
        const totalPages = Math.ceil(totalContacts / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;
        logger_1.default.info('Contacts retrieved successfully', {
            count: contacts.length,
            totalContacts,
            page: pageNumber
        });
        return {
            contacts,
            totalContacts,
            totalPages,
            currentPage: pageNumber,
            hasNextPage,
            hasPrevPage
        };
    }
    catch (error) {
        logger_1.default.error('Error in getAllContacts:', error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve contacts');
    }
};
// Get contact by ID
const getContactById = async (contactId) => {
    try {
        const contact = await contact_model_1.Contact.findById(contactId).lean();
        if (!contact) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Contact not found');
        }
        logger_1.default.info('Contact retrieved successfully', { contactId });
        return contact;
    }
    catch (error) {
        logger_1.default.error('Error in getContactById:', error);
        if (error.name === 'CastError') {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid contact ID format');
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve contact');
    }
};
// Delete contact by ID (optional - for admin use)
const deleteContactById = async (contactId) => {
    try {
        const deletedContact = await contact_model_1.Contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, 'Contact not found');
        }
        logger_1.default.info('Contact deleted successfully', { contactId });
    }
    catch (error) {
        logger_1.default.error('Error in deleteContactById:', error);
        if (error.name === 'CastError') {
            throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid contact ID format');
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to delete contact');
    }
};
// Get contact statistics (optional - for admin dashboard)
const getContactStats = async () => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalContacts, todayContacts, weekContacts, monthContacts] = await Promise.all([
            contact_model_1.Contact.countDocuments(),
            contact_model_1.Contact.countDocuments({ createdAt: { $gte: startOfDay } }),
            contact_model_1.Contact.countDocuments({ createdAt: { $gte: startOfWeek } }),
            contact_model_1.Contact.countDocuments({ createdAt: { $gte: startOfMonth } })
        ]);
        return {
            totalContacts,
            todayContacts,
            weekContacts,
            monthContacts
        };
    }
    catch (error) {
        logger_1.default.error('Error in getContactStats:', error);
        throw new ApiError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, 'Failed to retrieve contact statistics');
    }
};
exports.ContactService = {
    sendMailAndSaveContact,
    getAllContacts,
    getContactById,
    deleteContactById,
    getContactStats
};
//# sourceMappingURL=contact.service.js.map