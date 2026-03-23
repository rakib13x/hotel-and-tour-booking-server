import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ContactService } from "./contact.service";
import catchAsync from "../../utils/catchAsync";
import logger from "../../config/logger";
import sendResponse from "../../utils/sendResponse";


// Create contact and send emails
const createContact = catchAsync(async (req: Request, res: Response) => {
    const contactData = req.body;
    
    logger.info('Contact form submission received', { 
        email: contactData.email,
        name: contactData.name 
    });

    const result = await ContactService.sendMailAndSaveContact(contactData);

    sendResponse(res, StatusCodes.CREATED, {
        success: true,
        message: "Contact form submitted successfully! We'll get back to you soon.",
        data: {
            id: result._id,
            name: result.name,
            email: result.email,
            submittedAt: result.createdAt
        }
    });
});

// Get all contacts with pagination and search
const getAllContacts = catchAsync(async (req: Request, res: Response) => {
    const {
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search
    } = req.query;

    // Convert string parameters to appropriate types
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const sortOrderValue = (sortOrder as string).toLowerCase() === 'asc' ? 'asc' : 'desc';

    logger.info('Fetching contacts with filters', {
        page: pageNumber,
        limit: limitNumber,
        sortBy,
        sortOrder: sortOrderValue,
        search: search || 'none'
    });

    const result = await ContactService.getAllContacts(
        pageNumber,
        limitNumber,
        sortBy as string,
        sortOrderValue,
        search as string
    );

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Contacts retrieved successfully",
        data: result.contacts,
        pagination: {
            page: result.currentPage,
            limit: limitNumber,
            total: result.totalContacts,
            pages: result.totalPages
        }
    });
});

// Get contact by ID
const getContactById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    logger.info('Fetching contact by ID', { contactId: id });

    const result = await ContactService.getContactById(id as string);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Contact retrieved successfully",
        data: result
    });
});

// Delete contact by ID (optional - for admin use)
const deleteContactById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    logger.info('Deleting contact by ID', { contactId: id });

    await ContactService.deleteContactById(id as string);

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Contact deleted successfully",
        data: null
    });
});

// Get contact statistics (optional - for admin dashboard)
const getContactStats = catchAsync(async (req: Request, res: Response) => {
    logger.info('Fetching contact statistics');

    const result = await ContactService.getContactStats();

    sendResponse(res, StatusCodes.OK, {
        success: true,
        message: "Contact statistics retrieved successfully",
        data: result
    });
});

export const ContactController = {
    createContact,
    getAllContacts,
    getContactById,
    deleteContactById,
    getContactStats
};
