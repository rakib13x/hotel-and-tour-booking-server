"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyImagesService = void 0;
const companyImages_model_1 = require("./companyImages.model");
const createCompanyImagesToDB = async (payload) => {
    const result = await companyImages_model_1.CompanyImages.create(payload);
    return result;
};
const getAllCompanyImagesFromDB = async () => {
    const result = await companyImages_model_1.CompanyImages.find().sort({
        createdAt: -1,
    });
    return result;
};
const getCompanyImagesFromDB = async (id) => {
    const result = await companyImages_model_1.CompanyImages.findById(id);
    return result;
};
const updateCompanyImagesToDB = async (id, payload) => {
    const result = await companyImages_model_1.CompanyImages.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteCompanyImagesFromDB = async (id) => {
    const result = await companyImages_model_1.CompanyImages.findByIdAndDelete(id);
    return result;
};
// Delete specific image from any field
const deleteSpecificImageFromDB = async (id, fieldType, imageUrl) => {
    const updateQuery = { $pull: { [fieldType]: imageUrl } };
    const result = await companyImages_model_1.CompanyImages.findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
    });
    return result;
};
exports.CompanyImagesService = {
    createCompanyImagesToDB,
    getAllCompanyImagesFromDB,
    getCompanyImagesFromDB,
    updateCompanyImagesToDB,
    deleteCompanyImagesFromDB,
    deleteSpecificImageFromDB,
};
//# sourceMappingURL=companyImages.service.js.map