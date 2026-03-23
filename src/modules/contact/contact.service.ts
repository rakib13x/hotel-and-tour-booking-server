import { Contact, IContact } from "../../models/contact.model";
import { dynamicEmailHelper } from "../../helpers/dynamicEmailHelper";
import { emailTemplates } from "../../helpers/emailTemplates";
import logger from "../../config/logger";
import ApiError from "../../utils/ApiError";
import httpStatus from "http-status-codes";
import config from "../../config/env";

// Create contact and send emails
const sendMailAndSaveContact = async (contactData: IContact): Promise<IContact> => {
    try {
        // First, save the contact data to database
        const savedContact = await Contact.create(contactData);
        logger.info('Contact saved to database successfully', { contactId: savedContact._id });

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
        dynamicEmailHelper.sendEmailWithTemplate(
            emailTemplates.contact.adminNotification,
            { to: config.admin.email || 'admin@example.com' },
            emailData
        ).then((success: boolean) => {
            if (success) {
                logger.info('Admin notification email sent successfully');
            } else {
                logger.warn('Failed to send admin notification email');
            }
        }).catch((error: unknown) => {
            logger.error('Error sending admin notification:', error);
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

    } catch (error: any) {
        logger.error('Error in sendMailAndSaveContact:', error);
        
        if (error.name === 'ValidationError') {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Validation failed: ' + error.message
            );
        }
        
        if (error.code === 11000) {
            throw new ApiError(
                httpStatus.CONFLICT,
                'Duplicate entry detected'
            );
        }
        
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to process contact form submission'
        );
    }
};

// Get all contacts with pagination and sorting
const getAllContacts = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search?: string
): Promise<{
    contacts: IContact[];
    totalContacts: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}> => {
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
        const sortObject: any = {};
        sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute queries in parallel
        const [contacts, totalContacts] = await Promise.all([
            Contact.find(searchQuery)
                .sort(sortObject)
                .skip(skip)
                .limit(limitNumber)
                .lean(),
            Contact.countDocuments(searchQuery)
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(totalContacts / limitNumber);
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;

        logger.info('Contacts retrieved successfully', {
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

    } catch (error: any) {
        logger.error('Error in getAllContacts:', error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to retrieve contacts'
        );
    }
};

// Get contact by ID
const getContactById = async (contactId: string): Promise<IContact> => {
    try {
        const contact = await Contact.findById(contactId).lean();
        
        if (!contact) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                'Contact not found'
            );
        }

        logger.info('Contact retrieved successfully', { contactId });
        return contact;

    } catch (error: any) {
        logger.error('Error in getContactById:', error);
        
        if (error.name === 'CastError') {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Invalid contact ID format'
            );
        }
        
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to retrieve contact'
        );
    }
};

// Delete contact by ID (optional - for admin use)
const deleteContactById = async (contactId: string): Promise<void> => {
    try {
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        
        if (!deletedContact) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                'Contact not found'
            );
        }

        logger.info('Contact deleted successfully', { contactId });

    } catch (error: any) {
        logger.error('Error in deleteContactById:', error);
        
        if (error.name === 'CastError') {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Invalid contact ID format'
            );
        }
        
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete contact'
        );
    }
};

// Get contact statistics (optional - for admin dashboard)
const getContactStats = async (): Promise<{
    totalContacts: number;
    todayContacts: number;
    weekContacts: number;
    monthContacts: number;
}> => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalContacts, todayContacts, weekContacts, monthContacts] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ createdAt: { $gte: startOfDay } }),
            Contact.countDocuments({ createdAt: { $gte: startOfWeek } }),
            Contact.countDocuments({ createdAt: { $gte: startOfMonth } })
        ]);

        return {
            totalContacts,
            todayContacts,
            weekContacts,
            monthContacts
        };

    } catch (error: any) {
        logger.error('Error in getContactStats:', error);
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to retrieve contact statistics'
        );
    }
};

export const ContactService = {
    sendMailAndSaveContact,
    getAllContacts,
    getContactById,
    deleteContactById,
    getContactStats
};
