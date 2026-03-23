import { StatusCodes } from "http-status-codes";
import config from "../../config/env";
import { Team } from "../../models/team.model";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import ApiError from "../../utils/ApiError";
import APIFeatures from "../../utils/pagination";
import { ITeam, ITeamCreate, ITeamUpdate } from "./team.interface";

// Create team member
const createTeam = async (teamData: ITeamCreate): Promise<ITeam> => {
  try {
    console.log("=== CREATING TEAM MEMBER ===");
    console.log("Team data to save:", teamData);
    console.log("Image URL:", teamData.image);
    console.log("=== END CREATING TEAM MEMBER ===");

    const team = await Team.create(teamData);

    console.log("=== TEAM MEMBER CREATED ===");
    console.log("Created team member:", team);
    console.log("Saved image URL:", team.image);
    console.log("=== END TEAM MEMBER CREATED ===");

    return team;
  } catch (error) {
    console.error("=== TEAM CREATION ERROR ===");
    console.error("Error details:", error);
    console.error("=== END TEAM CREATION ERROR ===");
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create team member");
  }
};

// Get all team members with pagination and filtering
const getAllTeams = async (query: any) => {
  try {
    const apiFeatures = new APIFeatures(
      Team.find().sort({ order: 1, createdAt: 1 }),
      query
    )
      .search(["name", "designation"])
      .filter();

    const teams = await apiFeatures.query;

    return {
      teams,
    };
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch team members"
    );
  }
};

// Get single team member by ID
const getTeamById = async (id: string): Promise<ITeam | null> => {
  try {
    const team = await Team.findById(id);
    if (!team) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found");
    }
    return team;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch team member"
    );
  }
};

// Update team member
const updateTeam = async (
  id: string,
  updateData: ITeamUpdate
): Promise<ITeam | null> => {
  try {
    const team = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found");
    }

    return team;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to update team member"
    );
  }
};

// Delete team member
const deleteTeam = async (id: string): Promise<ITeam | null> => {
  try {
    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found");
    }

    return team;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to delete team member"
    );
  }
};

// Upload image to Cloudinary
const uploadTeamImage = async (file: Express.Multer.File): Promise<string> => {
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
    const { cloudName, apiKey, apiSecret } = config.cloudinary;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        "Cloudinary is not configured. Please check your environment variables."
      );
    }

    const result = await uploadImageToCloudinary(file.buffer, "team");
    console.log("Upload successful:", result);
    return result;
  } catch (error) {
    console.error("=== IMAGE UPLOAD ERROR ===");
    console.error("Error details:", error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error"
    );
    console.error("=== END IMAGE UPLOAD ERROR ===");
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to upload image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

// Reorder team members
const reorderTeams = async (teamIds: string[]): Promise<ITeam[]> => {
  try {
    console.log("=== REORDERING TEAM MEMBERS ===");
    console.log("New order:", teamIds);

    const updatePromises = teamIds.map((id, index) =>
      Team.findByIdAndUpdate(id, { order: index + 1 }, { new: true })
    );

    const updatedTeams = await Promise.all(updatePromises);

    console.log("=== REORDER COMPLETED ===");
    console.log("Updated teams:", updatedTeams.length);

    return updatedTeams.filter((team) => team !== null) as ITeam[];
  } catch (error) {
    console.error("=== REORDER ERROR ===");
    console.error("Error details:", error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to reorder team members"
    );
  }
};

export const TeamService = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  uploadTeamImage,
  reorderTeams,
};
