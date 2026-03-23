import { CompanyImages, ICompanyImages } from "./companyImages.model";

const createCompanyImagesToDB = async (
  payload: ICompanyImages
): Promise<ICompanyImages> => {
  const result = await CompanyImages.create(payload);
  return result;
};

const getAllCompanyImagesFromDB = async (): Promise<ICompanyImages[]> => {
  const result = await CompanyImages.find().sort({
    createdAt: -1,
  });
  return result;
};

const getCompanyImagesFromDB = async (
  id: string
): Promise<ICompanyImages | null> => {
  const result = await CompanyImages.findById(id);
  return result;
};

const updateCompanyImagesToDB = async (
  id: string,
  payload: Partial<ICompanyImages>
): Promise<ICompanyImages | null> => {
  const result = await CompanyImages.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCompanyImagesFromDB = async (
  id: string
): Promise<ICompanyImages | null> => {
  const result = await CompanyImages.findByIdAndDelete(id);
  return result;
};

// Delete specific image from any field
const deleteSpecificImageFromDB = async (
  id: string,
  fieldType: string,
  imageUrl: string
): Promise<ICompanyImages | null> => {
  const updateQuery = { $pull: { [fieldType]: imageUrl } };
  const result = await CompanyImages.findByIdAndUpdate(id, updateQuery, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const CompanyImagesService = {
  createCompanyImagesToDB,
  getAllCompanyImagesFromDB,
  getCompanyImagesFromDB,
  updateCompanyImagesToDB,
  deleteCompanyImagesFromDB,
  deleteSpecificImageFromDB,
};
