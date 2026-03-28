"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const http_status_codes_1 = require("http-status-codes");
const contact_service_1 = require("./contact.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const logger_1 = __importDefault(require("../../config/logger"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Create contact and send emails
const createContact = (0, catchAsync_1.default)(async (req, res) => {
    const contactData = req.body;
    logger_1.default.info('Contact form submission received', {
        email: contactData.email,
        name: contactData.name
    });
    const result = await contact_service_1.ContactService.sendMailAndSaveContact(contactData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
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
const getAllContacts = (0, catchAsync_1.default)(async (req, res) => {
    const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc', search } = req.query;
    // Convert string parameters to appropriate types
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const sortOrderValue = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';
    logger_1.default.info('Fetching contacts with filters', {
        page: pageNumber,
        limit: limitNumber,
        sortBy,
        sortOrder: sortOrderValue,
        search: search || 'none'
    });
    const result = await contact_service_1.ContactService.getAllContacts(pageNumber, limitNumber, sortBy, sortOrderValue, search);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
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
const getContactById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    logger_1.default.info('Fetching contact by ID', { contactId: id });
    const result = await contact_service_1.ContactService.getContactById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Contact retrieved successfully",
        data: result
    });
});
// Delete contact by ID (optional - for admin use)
const deleteContactById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    logger_1.default.info('Deleting contact by ID', { contactId: id });
    await contact_service_1.ContactService.deleteContactById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Contact deleted successfully",
        data: null
    });
});
// Get contact statistics (optional - for admin dashboard)
const getContactStats = (0, catchAsync_1.default)(async (req, res) => {
    logger_1.default.info('Fetching contact statistics');
    const result = await contact_service_1.ContactService.getContactStats();
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Contact statistics retrieved successfully",
        data: result
    });
});
exports.ContactController = {
    createContact,
    getAllContacts,
    getContactById,
    deleteContactById,
    getContactStats
};
//# sourceMappingURL=contact.controller.js.map