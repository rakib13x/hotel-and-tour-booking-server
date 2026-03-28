"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Country_1 = __importDefault(require("../../models/Country"));
const tour_model_1 = require("../../models/tour.model");
const visas_model_1 = require("../../models/visas.model");
class CountryService {
    async createCountry(input) {
        const country = new Country_1.default(input);
        return await country.save();
    }
    async getCountries(query) {
        const { page = 1, limit = 10, search, isTop } = query;
        const skip = (page - 1) * limit;
        // Build filter object
        const filter = {};
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }
        // Filter by isTop status
        if (isTop !== undefined && isTop !== null && isTop !== "") {
            // Convert string to boolean if needed
            const isTopBool = typeof isTop === "string" ? isTop === "true" : isTop;
            filter.isTop = isTopBool;
        }
        const [countries, total] = await Promise.all([
            Country_1.default
                .find(filter)
                .sort({ isTop: -1, name: 1 }) // Top countries first, then alphabetically
                .skip(skip)
                .limit(limit)
                .lean(),
            Country_1.default.countDocuments(filter),
        ]);
        const pages = Math.ceil(total / limit);
        const hasNext = page < pages;
        const hasPrev = page > 1;
        return {
            data: countries,
            pagination: {
                page,
                limit,
                total,
                pages,
                hasNext,
                hasPrev,
                ...(hasNext && { next: page + 1 }),
                ...(hasPrev && { prev: page - 1 }),
            },
        };
    }
    async getCountryById(id) {
        const country = await Country_1.default.findById(id);
        if (!country) {
            throw new Error("Country not found");
        }
        return country;
    }
    async updateCountry(id, input) {
        const country = await Country_1.default.findByIdAndUpdate(id, { ...input }, { new: true, runValidators: true });
        if (!country) {
            throw new Error("Country not found");
        }
        return country;
    }
    async deleteCountry(id) {
        const result = await Country_1.default.findByIdAndDelete(id);
        if (!result) {
            throw new Error("Country not found");
        }
    }
    async getPopularCountries(limit = 10) {
        // Get only Top countries (isTop: true), sorted by name
        return await Country_1.default
            .find({ isTop: true })
            .sort({ name: 1 })
            .limit(limit);
    }
    async searchCountries(searchTerm) {
        return await Country_1.default
            .find({
            name: { $regex: searchTerm, $options: "i" },
        })
            .sort({ isTop: -1, name: 1 });
    }
    async getTopCountries() {
        // Get all countries where isTop is true
        return await Country_1.default.find({ isTop: true }).sort({ name: 1 });
    }
    async getCountriesWithTours() {
        // 1. Get IDs of all countries that have at least one PUBLISHED tour
        const countryIds = await tour_model_1.Tour.distinct("destination", {
            status: "PUBLISHED",
        });
        // 2. Fetch those countries
        return await Country_1.default
            .find({ _id: { $in: countryIds } })
            .sort({ name: 1 });
    }
    async getCountriesWithVisas() {
        // 1. Get names of all countries that have an active visa entry
        const visaCountryNames = await visas_model_1.CountryVisa.distinct("countryName", {
            isActive: true,
        });
        // 2. Fetch those countries from the Country collection
        return await Country_1.default
            .find({ name: { $in: visaCountryNames } })
            .sort({ name: 1 });
    }
}
exports.default = new CountryService();
//# sourceMappingURL=country.service.js.map