"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const team_service_1 = require("./team.service");
// Create team member with image upload
const createTeam = (0, catchAsync_1.default)(async (req, res) => {
    // Debug logging
    console.log("=== TEAM CREATE DEBUG ===");
    console.log("Body received:", req.body);
    console.log("File received:", req.file);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("=== END TEAM CREATE DEBUG ===");
    const { name, designation } = req.body;
    // Check if image file is provided (make it optional for now)
    // if (!req.file) {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Image file is required');
    // }
    // Upload image to Cloudinary if provided
    let imageUrl = "";
    if (req.file) {
        // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
        if (req.file.path && req.file.path.trim() !== "") {
            console.log("File already uploaded to Cloudinary, using path:", req.file.path);
            imageUrl = req.file.path;
        }
        else {
            console.log("File has no valid path, trying manual upload...");
            try {
                imageUrl = await team_service_1.TeamService.uploadTeamImage(req.file);
            }
            catch (error) {
                console.error("Image upload failed:", error);
                // Check if it's a Cloudinary configuration error
                if (error instanceof Error &&
                    error.message.includes("Cloudinary is not configured")) {
                    return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
                        success: false,
                        message: "Image upload service is not configured. Please contact administrator.",
                    });
                }
                // For other errors, continue with placeholder
                imageUrl = "https://via.placeholder.com/300x300?text=Upload+Failed";
            }
        }
    }
    else {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Image is required for team members",
        });
    }
    // Create team member with the uploaded image URL
    const teamData = {
        name,
        designation,
        image: imageUrl || "https://via.placeholder.com/300x300?text=Upload+Failed",
    };
    const result = await team_service_1.TeamService.createTeam(teamData);
    console.log("=== TEAM CREATED SUCCESSFULLY ===");
    console.log("Created team member:", result);
    console.log("Image URL:", result.image);
    console.log("=== END TEAM CREATED ===");
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Team member created successfully",
        data: result,
    });
});
// Create team member with image URL (alternative method)
const createTeamWithUrl = (0, catchAsync_1.default)(async (req, res) => {
    const teamData = req.body;
    const result = await team_service_1.TeamService.createTeam(teamData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.CREATED, {
        success: true,
        message: "Team member created successfully",
        data: result,
    });
});
// Get all team members
const getAllTeams = (0, catchAsync_1.default)(async (req, res) => {
    const result = await team_service_1.TeamService.getAllTeams(req.query);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team members retrieved successfully",
        data: result.teams,
    });
});
// Get single team member
const getTeamById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await team_service_1.TeamService.getTeamById(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team member retrieved successfully",
        data: result,
    });
});
// Update team member (text fields only)
const updateTeam = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const result = await team_service_1.TeamService.updateTeam(id, updateData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team member updated successfully",
        data: result,
    });
});
// Update team member with image upload
const updateTeamWithImage = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { name, designation } = req.body;
    let updateData = {};
    // Add text fields if provided
    if (name)
        updateData.name = name;
    if (designation)
        updateData.designation = designation;
    // Handle image upload if provided
    if (req.file) {
        // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
        if (req.file.path && req.file.path.trim() !== "") {
            console.log("Update: File already uploaded to Cloudinary, using path:", req.file.path);
            updateData.image = req.file.path;
        }
        else {
            console.log("Update: File has no valid path, trying manual upload...");
            try {
                const imageUrl = await team_service_1.TeamService.uploadTeamImage(req.file);
                updateData.image = imageUrl;
            }
            catch (error) {
                console.error("Update: Image upload failed:", error);
                // Continue without updating image if upload fails
            }
        }
    }
    const result = await team_service_1.TeamService.updateTeam(id, updateData);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team member updated successfully",
        data: result,
    });
});
// Delete team member
const deleteTeam = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await team_service_1.TeamService.deleteTeam(id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team member deleted successfully",
        data: result,
    });
});
// Upload team image
const uploadTeamImage = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.file) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No image file provided");
    }
    console.log("=== UPLOAD TEAM IMAGE DEBUG ===");
    console.log("File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        bufferLength: req.file.buffer?.length,
    });
    let imageUrl = "";
    // Check if file has valid path (Cloudinary storage)
    if (req.file.path && req.file.path.trim() !== "") {
        console.log("File already uploaded to Cloudinary:", req.file.path);
        imageUrl = req.file.path;
    }
    else {
        console.log("Manual upload needed...");
        imageUrl = await team_service_1.TeamService.uploadTeamImage(req.file);
    }
    console.log("=== END UPLOAD TEAM IMAGE DEBUG ===");
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Image uploaded successfully",
        data: { imageUrl },
    });
});
// Reorder team members
const reorderTeams = (0, catchAsync_1.default)(async (req, res) => {
    const { teamIds } = req.body;
    if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
        return (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, {
            success: false,
            message: "Team IDs array is required",
        });
    }
    const reorderedTeams = await team_service_1.TeamService.reorderTeams(teamIds);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: "Team members reordered successfully",
        data: reorderedTeams,
    });
});
exports.TeamController = {
    createTeam,
    createTeamWithUrl,
    getAllTeams,
    getTeamById,
    updateTeam,
    updateTeamWithImage,
    deleteTeam,
    uploadTeamImage,
    reorderTeams,
};
//# sourceMappingURL=team.controller.js.map