import { StatusCodes } from "http-status-codes";
import { CountryVisa } from "../../models/visas.model";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import { ICountryVisa } from "./visa.interface";

interface CreateCountryVisaInput {
  countryName: string;
  visaTypes: string[];
  processingFee?: number;
  required_document?: string;
  isActive?: boolean;
}

interface UpdateCountryVisaInput extends Partial<CreateCountryVisaInput> {}

const createCountryVisaIntoDB = async (
  payload: CreateCountryVisaInput
): Promise<ICountryVisa> => {
  try {
    // Check if visa information already exists for this country
    const existingCountry = await CountryVisa.findOne({
      countryName: payload.countryName,
    });

    if (existingCountry) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Visa information already exists for this country"
      );
    }

    const result = await CountryVisa.create([payload]);

    if (!result || result.length === 0) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Failed to create country visa"
      );
    }

    return result[0]!;
  } catch (error) {
    throw error;
  }
};

const getAllCountryVisasFromDB = async (query: Record<string, any>) => {
  const apiFeatures = new APIFeatures(CountryVisa.find(), query);

  // Search functionality
  apiFeatures.search(["countryName", "visaTypes"]);

  // Filter functionality
  apiFeatures.filter();

  // Get pagination info
  const paginationInfo = await apiFeatures.pagination();

  // Execute query
  const result = await apiFeatures.query;

  return {
    data: result,
    pagination: {
      page: paginationInfo.currentPage,
      limit: paginationInfo.limit,
      total: paginationInfo.total,
      pages: paginationInfo.totalPages,
    },
  };
};

const getSingleCountryVisaFromDB = async (
  id: string
): Promise<ICountryVisa | null> => {
  checkValidID(id);
  const result = await CountryVisa.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Country visa not found");
  }
  return result;
};

const getCountryVisaByCountryNameFromDB = async (
  countryName: string
): Promise<ICountryVisa | null> => {
  const result = await CountryVisa.findOne({
    countryName: { $regex: new RegExp(countryName, "i") },
  });
  // Return null if not found instead of throwing error
  // This allows frontend to handle "no data" gracefully
  return result;
};

const updateCountryVisaIntoDB = async (
  id: string,
  payload: UpdateCountryVisaInput
): Promise<ICountryVisa | null> => {
  checkValidID(id);

  try {
    // Check if country name is being updated and if visa info already exists for new country
    if (payload.countryName) {
      const existingCountry = await CountryVisa.findOne({
        countryName: payload.countryName,
        _id: { $ne: id },
      });

      if (existingCountry) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "Visa information already exists for this country"
        );
      }
    }

    const result = await CountryVisa.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!result) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Country visa not found");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const deleteCountryVisaFromDB = async (
  id: string
): Promise<ICountryVisa | null> => {
  checkValidID(id);
  const result = await CountryVisa.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Country visa not found");
  }
  return result;
};

const getActiveCountryVisasFromDB = async (): Promise<ICountryVisa[]> => {
  const result = await CountryVisa.find({ isActive: true }).sort({
    countryName: 1,
  });
  return result;
};

const toggleCountryVisaStatusInDB = async (
  id: string,
  isActive: boolean
): Promise<ICountryVisa | null> => {
  checkValidID(id);
  const result = await CountryVisa.findByIdAndUpdate(
    id,
    { isActive },
    { new: true }
  );
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Country visa not found");
  }
  return result;
};

const getCountryVisasByVisaTypeFromDB = async (
  visaType: string
): Promise<ICountryVisa[]> => {
  const result = await CountryVisa.find({
    visaTypes: { $in: [visaType] },
    isActive: true,
  }).sort({ countryName: 1 });
  return result;
};

export const CountryVisaService = {
  createCountryVisaIntoDB,
  getAllCountryVisasFromDB,
  getSingleCountryVisaFromDB,
  getCountryVisaByCountryNameFromDB,
  updateCountryVisaIntoDB,
  deleteCountryVisaFromDB,
  getActiveCountryVisasFromDB,
  toggleCountryVisaStatusInDB,
  getCountryVisasByVisaTypeFromDB,
};
