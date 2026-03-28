import {
  CorporateClient,
  ICorporateClient,
} from "../../models/corporateClients.model";
import { checkValidID } from "../../utils/checkValidID";
import APIFeatures from "../../utils/pagination";

const createCorporateClientIntoDB = async (
  payload: ICorporateClient
): Promise<ICorporateClient> => {
  const result = await CorporateClient.create(payload);
  return result;
};

const getAllCorporateClientsFromDB = async (query: any) => {
  const corporateClientsQuery = CorporateClient.find({});

  // Default sort by order (ascending) if no sort specified
  const features = new APIFeatures(corporateClientsQuery, query)
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

const getSingleCorporateClientFromDB = async (
  id: string
): Promise<ICorporateClient | null> => {
  checkValidID(id);
  const result = await CorporateClient.findById(id);
  return result;
};

const updateCorporateClientIntoDB = async (
  id: string,
  payload: Partial<ICorporateClient>
): Promise<ICorporateClient | null> => {
  checkValidID(id);
  const result = await CorporateClient.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCorporateClientFromDB = async (
  id: string
): Promise<ICorporateClient | null> => {
  checkValidID(id);
  const result = await CorporateClient.findByIdAndDelete(id);
  return result;
};

const getPublicCorporateClientsFromDB = async () => {
  const result = await CorporateClient.find({}).sort({ order: 1 });
  return result;
};

const reorderCorporateClientsIntoDB = async (clientIds: string[]) => {
  try {
    console.log("=== REORDER CORPORATE CLIENTS SERVICE ===");
    console.log("Client IDs received:", clientIds);
    console.log("Client IDs count:", clientIds.length);

    const updatePromises = clientIds.map((id, index) => {
      console.log(`Setting client ${id} to order ${index + 1}`);
      return CorporateClient.findByIdAndUpdate(
        id,
        { order: index + 1 },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
    console.log("All updates completed");

    // Return updated clients in new order
    const updatedClients = await CorporateClient.find({
      _id: { $in: clientIds },
    }).sort({ order: 1 });

    console.log("Updated clients count:", updatedClients.length);
    console.log(
      "Updated clients order:",
      updatedClients.map((c: any) => ({
        id: c._id,
        name: c.name,
        order: c.order,
      }))
    );
    console.log("=== END REORDER CORPORATE CLIENTS SERVICE ===");

    return updatedClients;
  } catch (error) {
    console.error("Reorder error:", error);
    throw new Error("Failed to reorder corporate clients");
  }
};

export const CorporateClientService = {
  createCorporateClientIntoDB,
  getAllCorporateClientsFromDB,
  getSingleCorporateClientFromDB,
  updateCorporateClientIntoDB,
  deleteCorporateClientFromDB,
  getPublicCorporateClientsFromDB,
  reorderCorporateClientsIntoDB,
};
