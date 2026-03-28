"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const http_status_codes_1 = require("http-status-codes");
const env_1 = __importDefault(require("../../config/env"));
const team_model_1 = require("../../models/team.model");
const cloudinary_1 = require("../../services/cloudinary");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const pagination_1 = __importDefault(require("../../utils/pagination"));
// Create team member
const createTeam = async (teamData) => {
    try {
        console.log("=== CREATING TEAM MEMBER ===");
        console.log("Team data to save:", teamData);
        console.log("Image URL:", teamData.image);
        console.log("=== END CREATING TEAM MEMBER ===");
        const team = await team_model_1.Team.create(teamData);
        console.log("=== TEAM MEMBER CREATED ===");
        console.log("Created team member:", team);
        console.log("Saved image URL:", team.image);
        console.log("=== END TEAM MEMBER CREATED ===");
        return team;
    }
    catch (error) {
        console.error("=== TEAM CREATION ERROR ===");
        console.error("Error details:", error);
        console.error("=== END TEAM CREATION ERROR ===");
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Failed to create team member");
    }
};
// Get all team members with pagination and filtering
const getAllTeams = async (query) => {
    try {
        const apiFeatures = new pagination_1.default(team_model_1.Team.find().sort({ order: 1, createdAt: 1 }), query)
            .search(["name", "designation"])
            .filter();
        const teams = await apiFeatures.query;
        return {
            teams,
        };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch team members");
    }
};
// Get single team member by ID
const getTeamById = async (id) => {
    try {
        const team = await team_model_1.Team.findById(id);
        if (!team) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Team member not found");
        }
        return team;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to fetch team member");
    }
};
// Update team member
const updateTeam = async (id, updateData) => {
    try {
        const team = await team_model_1.Team.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!team) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Team member not found");
        }
        return team;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update team member");
    }
};
// Delete team member
const deleteTeam = async (id) => {
    try {
        const team = await team_model_1.Team.findByIdAndDelete(id);
        if (!team) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Team member not found");
        }
        return team;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete team member");
    }
};
// Upload image to Cloudinary
const uploadTeamImage = async (file) => {
    try {
        console.log("=== UPLOADING TEAM IMAGE ===");
        console.log("File details:", {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            bufferLength: file.buffer?.length,
        });
        if (!file.buffer || file.buffer.length === 0) {
            throw new Error("File buffer is empty or invalid");
        }
        // Check if Cloudinary is configured
        const { cloudName, apiKey, apiSecret } = env_1.default.cloudinary;
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary is not configured. Please check your environment variables.");
        }
        const result = await (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, "team");
        console.log("Upload successful:", result);
        return result;
    }
    catch (error) {
        console.error("=== IMAGE UPLOAD ERROR ===");
        console.error("Error details:", error);
        console.error("Error message:", error instanceof Error ? error.message : "Unknown error");
        console.error("=== END IMAGE UPLOAD ERROR ===");
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
};
// Reorder team members
const reorderTeams = async (teamIds) => {
    try {
        console.log("=== REORDERING TEAM MEMBERS ===");
        console.log("New order:", teamIds);
        const updatePromises = teamIds.map((id, index) => team_model_1.Team.findByIdAndUpdate(id, { order: index + 1 }, { new: true }));
        const updatedTeams = await Promise.all(updatePromises);
        console.log("=== REORDER COMPLETED ===");
        console.log("Updated teams:", updatedTeams.length);
        return updatedTeams.filter((team) => team !== null);
    }
    catch (error) {
        console.error("=== REORDER ERROR ===");
        console.error("Error details:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to reorder team members");
    }
};
exports.TeamService = {
    createTeam,
    getAllTeams,
    getTeamById,
    updateTeam,
    deleteTeam,
    uploadTeamImage,
    reorderTeams,
};
//# sourceMappingURL=team.service.js.map