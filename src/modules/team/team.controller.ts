import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ITeamCreate, ITeamUpdate } from "./team.interface";
import { TeamService } from "./team.service";

// Create team member with image upload
const createTeam = catchAsync(async (req: Request, res: Response) => {
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
      console.log(
        "File already uploaded to Cloudinary, using path:",
        req.file.path
      );
      imageUrl = req.file.path;
    } else {
      console.log("File has no valid path, trying manual upload...");
      try {
        imageUrl = await TeamService.uploadTeamImage(req.file);
      } catch (error) {
        console.error("Image upload failed:", error);

        // Check if it's a Cloudinary configuration error
        if (
          error instanceof Error &&
          error.message.includes("Cloudinary is not configured")
        ) {
          return sendResponse(res, StatusCodes.BAD_REQUEST, {
            success: false,
            message:
              "Image upload service is not configured. Please contact administrator.",
          });
        }

        // For other errors, continue with placeholder
        imageUrl = "https://via.placeholder.com/300x300?text=Upload+Failed";
      }
    }
  } else {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Image is required for team members",
    });
  }

  // Create team member with the uploaded image URL
  const teamData: ITeamCreate = {
    name,
    designation,
    image: imageUrl || "https://via.placeholder.com/300x300?text=Upload+Failed",
  };

  const result = await TeamService.createTeam(teamData);

  console.log("=== TEAM CREATED SUCCESSFULLY ===");
  console.log("Created team member:", result);
  console.log("Image URL:", result.image);
  console.log("=== END TEAM CREATED ===");

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Team member created successfully",
    data: result,
  });
});

// Create team member with image URL (alternative method)
const createTeamWithUrl = catchAsync(async (req: Request, res: Response) => {
  const teamData: ITeamCreate = req.body;

  const result = await TeamService.createTeam(teamData);

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Team member created successfully",
    data: result,
  });
});

// Get all team members
const getAllTeams = catchAsync(async (req: Request, res: Response) => {
  const result = await TeamService.getAllTeams(req.query);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team members retrieved successfully",
    data: result.teams,
  });
});

// Get single team member
const getTeamById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TeamService.getTeamById(id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team member retrieved successfully",
    data: result,
  });
});

// Update team member (text fields only)
const updateTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: ITeamUpdate = req.body;

  const result = await TeamService.updateTeam(id as string, updateData);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team member updated successfully",
    data: result,
  });
});

// Update team member with image upload
const updateTeamWithImage = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, designation } = req.body;

  let updateData: ITeamUpdate = {};

  // Add text fields if provided
  if (name) updateData.name = name;
  if (designation) updateData.designation = designation;

  // Handle image upload if provided
  if (req.file) {
    // Check if file has valid data (for Cloudinary storage, check path instead of buffer)
    if (req.file.path && req.file.path.trim() !== "") {
      console.log(
        "Update: File already uploaded to Cloudinary, using path:",
        req.file.path
      );
      updateData.image = req.file.path;
    } else {
      console.log("Update: File has no valid path, trying manual upload...");
      try {
        const imageUrl = await TeamService.uploadTeamImage(req.file);
        updateData.image = imageUrl;
      } catch (error) {
        console.error("Update: Image upload failed:", error);
        // Continue without updating image if upload fails
      }
    }
  }

  const result = await TeamService.updateTeam(id as string, updateData);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team member updated successfully",
    data: result,
  });
});

// Delete team member
const deleteTeam = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TeamService.deleteTeam(id as string);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team member deleted successfully",
    data: result,
  });
});

// Upload team image
const uploadTeamImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No image file provided");
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
  } else {
    console.log("Manual upload needed...");
    imageUrl = await TeamService.uploadTeamImage(req.file);
  }

  console.log("=== END UPLOAD TEAM IMAGE DEBUG ===");

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Image uploaded successfully",
    data: { imageUrl },
  });
});

// Reorder team members
const reorderTeams = catchAsync(async (req: Request, res: Response) => {
  const { teamIds } = req.body;

  if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Team IDs array is required",
    });
  }

  const reorderedTeams = await TeamService.reorderTeams(teamIds);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Team members reordered successfully",
    data: reorderedTeams,
  });
});

export const TeamController = {
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
