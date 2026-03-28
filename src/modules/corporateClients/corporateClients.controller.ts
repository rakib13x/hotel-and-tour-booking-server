import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { uploadImageToCloudinary } from "../../services/cloudinary";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CorporateClientService } from "./corporateClients.service";

const createCorporateClient = catchAsync(
  async (req: Request, res: Response) => {
    // Handle file uploads
    console.log("=== CORPORATE CLIENT CREATION DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Request headers:", req.headers);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("Files received:", files);
    console.log("Files keys:", Object.keys(files || {}));
    const logoFile = files?.coverImage?.[0];

    console.log("Logo file:", logoFile);
    console.log("Logo file buffer:", logoFile?.buffer);
    console.log("Logo file size:", logoFile?.size);
    console.log("Logo file mimetype:", logoFile?.mimetype);

    // Check if logo is provided
    if (!logoFile) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Logo is required",
      });
    }

    // Upload logo to Cloudinary
    if (logoFile && logoFile.buffer) {
      console.log("Uploading logo to Cloudinary...");
      const logoUrl = await uploadImageToCloudinary(
        logoFile.buffer,
        "corporate-clients/logos"
      );
      req.body.logo = logoUrl;
      console.log("Logo uploaded:", logoUrl);
    }

    const result = await CorporateClientService.createCorporateClientIntoDB(
      req.body
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate client created successfully",
      data: result,
    });
  }
);

const getAllCorporateClients = catchAsync(
  async (req: Request, res: Response) => {
    console.log("=== GET ALL CORPORATE CLIENTS CONTROLLER ===");
    console.log("Query params:", req.query);

    const result = await CorporateClientService.getAllCorporateClientsFromDB(
      req.query
    );

    console.log("Retrieved clients count:", result.length);
    console.log(
      "Client orders:",
      result.map((c) => ({ id: c._id, name: c.name, order: c.order }))
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate clients retrieved successfully",
      data: result,
    });
  }
);

const getSingleCorporateClient = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "ID is required",
      });
    }
    const result = await CorporateClientService.getSingleCorporateClientFromDB(
      id
    );

    if (!result) {
      return sendResponse(res, StatusCodes.NOT_FOUND, {
        success: false,
        message: "Corporate client not found",
      });
    }

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate client retrieved successfully",
      data: result,
    });
  }
);

const updateCorporateClient = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "ID is required",
      });
    }

    // Handle file upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logoFile = files?.coverImage?.[0];

    // Upload logo to Cloudinary if provided
    if (logoFile) {
      const logoUrl = await uploadImageToCloudinary(
        logoFile.buffer,
        "corporate-clients/logos"
      );
      req.body.logo = logoUrl;
    }

    const result = await CorporateClientService.updateCorporateClientIntoDB(
      id,
      req.body
    );

    if (!result) {
      return sendResponse(res, StatusCodes.NOT_FOUND, {
        success: false,
        message: "Corporate client not found",
      });
    }

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate client updated successfully",
      data: result,
    });
  }
);

const deleteCorporateClient = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "ID is required",
      });
    }

    const result = await CorporateClientService.deleteCorporateClientFromDB(id);

    if (!result) {
      return sendResponse(res, StatusCodes.NOT_FOUND, {
        success: false,
        message: "Corporate client not found",
      });
    }

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate client deleted successfully",
      data: result,
    });
  }
);

// Public API for frontend
const getPublicCorporateClients = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CorporateClientService.getPublicCorporateClientsFromDB();
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate clients retrieved successfully",
      data: result,
    });
  }
);

// Reorder corporate clients (Admin only)
const reorderCorporateClients = catchAsync(
  async (req: Request, res: Response) => {
    const { clientIds } = req.body;

    console.log("=== REORDER CORPORATE CLIENTS CONTROLLER ===");
    console.log("Request body:", req.body);
    console.log("Client IDs:", clientIds);

    if (!Array.isArray(clientIds) || clientIds.length === 0) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Client IDs array is required",
      });
    }

    const result = await CorporateClientService.reorderCorporateClientsIntoDB(
      clientIds
    );

    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Corporate clients reordered successfully",
      data: result,
    });
  }
);

export const CorporateClientController = {
  createCorporateClient,
  getAllCorporateClients,
  getSingleCorporateClient,
  updateCorporateClient,
  deleteCorporateClient,
  getPublicCorporateClients,
  reorderCorporateClients,
};
