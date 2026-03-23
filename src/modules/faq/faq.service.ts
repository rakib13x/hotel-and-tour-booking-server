import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";
import { IFaq, IFaqFilters, IFaqStats, IReorderFaqs } from "./faq.interface";
import { Faq } from "../../models/faq.model";

const createFaqIntoDB = async (payload: any): Promise<IFaq> => {
  // If orderIndex is not provided, set it to the highest + 1
  if (!payload.orderIndex) {
    const lastFaq = await Faq.findOne().sort({ orderIndex: -1 });
    payload.orderIndex = lastFaq ? lastFaq.orderIndex + 1 : 1;
  }

  const result = await Faq.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create FAQ");
  }

  return result;
};

const getAllFaqsFromDB = async (query: IFaqFilters = {}) => {
  // Transform sortBy and sortOrder to sort parameter for APIFeatures
  const queryParams: any = { ...query };
  if (query.sortBy && query.sortOrder) {
    queryParams.sort = `${query.sortOrder === "desc" ? "-" : ""}${
      query.sortBy
    }`;
    delete queryParams.sortBy;
    delete queryParams.sortOrder;
  }

  const apiFeatures = new APIFeatures(Faq.find(), queryParams);

  // Search functionality
  apiFeatures.search(["question", "answer"]);

  // Filter functionality
  apiFeatures.filter();

  // Sort functionality
  apiFeatures.sort();

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

const getSingleFaqFromDB = async (id: string): Promise<IFaq | null> => {
  checkValidID(id);
  const result = await Faq.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "FAQ not found");
  }
  return result;
};

const updateFaqIntoDB = async (
  id: string,
  payload: any,
): Promise<IFaq | null> => {
  checkValidID(id);

  const result = await Faq.findByIdAndUpdate(
    id,
    { ...payload, updatedAt: new Date() },
    { new: true, runValidators: true },
  );

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "FAQ not found");
  }

  return result;
};

const deleteFaqFromDB = async (id: string): Promise<IFaq | null> => {
  checkValidID(id);
  const result = await Faq.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "FAQ not found");
  }
  return result;
};

const toggleFaqStatusFromDB = async (id: string): Promise<IFaq | null> => {
  checkValidID(id);
  const faq = await Faq.findById(id);
  if (!faq) {
    throw new ApiError(StatusCodes.NOT_FOUND, "FAQ not found");
  }

  faq.isActive = !faq.isActive;
  await faq.save();

  return faq;
};

const reorderFaqsFromDB = async (data: IReorderFaqs): Promise<void> => {
  const { faqs } = data;

  // Validate all FAQ IDs exist
  const faqIds = faqs.map((f) => f.id);
  const existingFaqs = await Faq.find({ _id: { $in: faqIds } });

  if (existingFaqs.length !== faqIds.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "One or more FAQ IDs are invalid",
    );
  }

  // Update order indices
  const updatePromises = faqs.map(({ id, orderIndex }) =>
    Faq.findByIdAndUpdate(id, { orderIndex }),
  );

  await Promise.all(updatePromises);
};

const getActiveFaqsFromDB = async (): Promise<IFaq[]> => {
  const result = (await Faq.find({ isActive: true })
    .sort({ orderIndex: 1 })
    .lean()) as unknown as IFaq[];
  return result;
};

const getFaqStatsFromDB = async (): Promise<IFaqStats> => {
  const [total, active, inactive] = await Promise.all([
    Faq.countDocuments(),
    Faq.countDocuments({ isActive: true }),
    Faq.countDocuments({ isActive: false }),
  ]);

  return { total, active, inactive };
};

export const FaqService = {
  createFaqIntoDB,
  getAllFaqsFromDB,
  getSingleFaqFromDB,
  updateFaqIntoDB,
  deleteFaqFromDB,
  toggleFaqStatusFromDB,
  reorderFaqsFromDB,
  getActiveFaqsFromDB,
  getFaqStatsFromDB,
};
