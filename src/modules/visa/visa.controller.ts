import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CountryVisaService } from "./visa.service";

const createCountryVisa = catchAsync(async (req: Request, res: Response) => {
  const result = await CountryVisaService.createCountryVisaIntoDB(req.body);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Country visa created successfully",
    data: result,
  });
});

const getAllCountryVisas = catchAsync(async (req: Request, res: Response) => {
  const result = await CountryVisaService.getAllCountryVisasFromDB(req.query);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Country visas retrieved successfully",
    data: result.data,
    pagination: result.pagination,
  });
});

const getActiveCountryVisas = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CountryVisaService.getActiveCountryVisasFromDB();
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Active country visas retrieved successfully",
      data: result,
    });
  }
);

const getSingleCountryVisa = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Country visa ID is required",
    });
  }
  const result = await CountryVisaService.getSingleCountryVisaFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Country visa retrieved successfully",
    data: result,
  });
});

const getCountryVisaByCountryName = catchAsync(
  async (req: Request, res: Response) => {
    const countryName = req.params.countryName as string;
    if (!countryName) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Country name is required",
      });
    }
    const result = await CountryVisaService.getCountryVisaByCountryNameFromDB(
      countryName
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Country visa retrieved successfully",
      data: result,
    });
  }
);

const getCountryVisasByVisaType = catchAsync(
  async (req: Request, res: Response) => {
    const visaType = req.params.visaType as string;
    if (!visaType) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Visa type is required",
      });
    }
    const result = await CountryVisaService.getCountryVisasByVisaTypeFromDB(
      visaType
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: "Country visas retrieved successfully",
      data: result,
    });
  }
);

const updateCountryVisa = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Country visa ID is required",
    });
  }

  const result = await CountryVisaService.updateCountryVisaIntoDB(id, req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Country visa updated successfully",
    data: result,
  });
});

const deleteCountryVisa = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    return sendResponse(res, StatusCodes.BAD_REQUEST, {
      success: false,
      message: "Country visa ID is required",
    });
  }

  const result = await CountryVisaService.deleteCountryVisaFromDB(id);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Country visa deleted successfully",
    data: result,
  });
});

const toggleCountryVisaStatus = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { isActive } = req.body;

    if (!id) {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "Country visa ID is required",
      });
    }

    if (typeof isActive !== "boolean") {
      return sendResponse(res, StatusCodes.BAD_REQUEST, {
        success: false,
        message: "isActive must be a boolean value",
      });
    }

    const result = await CountryVisaService.toggleCountryVisaStatusInDB(
      id,
      isActive
    );
    sendResponse(res, StatusCodes.OK, {
      success: true,
      message: `Country visa ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      data: result,
    });
  }
);

export const CountryVisaController = {
  createCountryVisa,
  getAllCountryVisas,
  getActiveCountryVisas,
  getSingleCountryVisa,
  getCountryVisaByCountryName,
  getCountryVisasByVisaType,
  updateCountryVisa,
  deleteCountryVisa,
  toggleCountryVisaStatus,
};
