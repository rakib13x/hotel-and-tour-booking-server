"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorporateClientService = void 0;
const corporateClients_model_1 = require("../../models/corporateClients.model");
const checkValidID_1 = require("../../utils/checkValidID");
const pagination_1 = __importDefault(require("../../utils/pagination"));
const createCorporateClientIntoDB = async (payload) => {
    const result = await corporateClients_model_1.CorporateClient.create(payload);
    return result;
};
const getAllCorporateClientsFromDB = async (query) => {
    const corporateClientsQuery = corporateClients_model_1.CorporateClient.find({});
    // Default sort by order (ascending) if no sort specified
    const features = new pagination_1.default(corporateClientsQuery, query)
        .filter()
        .sort()
        .limitFields();
    // If no sort query provided, sort by order ascending
    if (!query.sort) {
        const result = await features.query.sort({ order: 1 });
        return result;
    }
    const result = await features.query;
    return result;
};
const getSingleCorporateClientFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await corporateClients_model_1.CorporateClient.findById(id);
    return result;
};
const updateCorporateClientIntoDB = async (id, payload) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await corporateClients_model_1.CorporateClient.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteCorporateClientFromDB = async (id) => {
    (0, checkValidID_1.checkValidID)(id);
    const result = await corporateClients_model_1.CorporateClient.findByIdAndDelete(id);
    return result;
};
const getPublicCorporateClientsFromDB = async () => {
    const result = await corporateClients_model_1.CorporateClient.find({}).sort({ order: 1 });
    return result;
};
const reorderCorporateClientsIntoDB = async (clientIds) => {
    try {
        console.log("=== REORDER CORPORATE CLIENTS SERVICE ===");
        console.log("Client IDs received:", clientIds);
        console.log("Client IDs count:", clientIds.length);
        const updatePromises = clientIds.map((id, index) => {
            console.log(`Setting client ${id} to order ${index + 1}`);
            return corporateClients_model_1.CorporateClient.findByIdAndUpdate(id, { order: index + 1 }, { new: true });
        });
        await Promise.all(updatePromises);
        console.log("All updates completed");
        // Return updated clients in new order
        const updatedClients = await corporateClients_model_1.CorporateClient.find({
            _id: { $in: clientIds },
        }).sort({ order: 1 });
        console.log("Updated clients count:", updatedClients.length);
        console.log("Updated clients order:", updatedClients.map((c) => ({
            id: c._id,
            name: c.name,
            order: c.order,
        })));
        console.log("=== END REORDER CORPORATE CLIENTS SERVICE ===");
        return updatedClients;
    }
    catch (error) {
        console.error("Reorder error:", error);
        throw new Error("Failed to reorder corporate clients");
    }
};
exports.CorporateClientService = {
    createCorporateClientIntoDB,
    getAllCorporateClientsFromDB,
    getSingleCorporateClientFromDB,
    updateCorporateClientIntoDB,
    deleteCorporateClientFromDB,
    getPublicCorporateClientsFromDB,
    reorderCorporateClientsIntoDB,
};
//# sourceMappingURL=corporateClients.service.js.map