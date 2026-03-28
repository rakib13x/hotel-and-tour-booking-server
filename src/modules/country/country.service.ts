import Country, { ICountry } from "../../models/Country";
import { Tour } from "../../models/tour.model";
import { CountryVisa } from "../../models/visas.model";
import { PaginationResult } from "../../utils/pagination";

interface CreateCountryInput {
  name: string;
  imageUrl: string;
  isTop?: boolean;
}

interface UpdateCountryInput extends Partial<CreateCountryInput> {}

interface GetCountriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isTop?: string | boolean;
}

class CountryService {
  async createCountry(input: CreateCountryInput): Promise<ICountry> {
    const country = new Country(input);
    return await country.save();
  }

  async getCountries(
    query: GetCountriesQuery
  ): Promise<PaginationResult<ICountry>> {
    const { page = 1, limit = 10, search, isTop } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

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
      (Country as any)
        .find(filter)
        .sort({ isTop: -1, name: 1 }) // Top countries first, then alphabetically
        .skip(skip)
        .limit(limit)
        .lean(),
      (Country as any).countDocuments(filter),
    ]);

    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    return {
      data: countries as ICountry[],
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

  async getCountryById(id: string): Promise<ICountry> {
    const country = await (Country as any).findById(id);
    if (!country) {
      throw new Error("Country not found");
    }
    return country;
  }

  async updateCountry(
    id: string,
    input: UpdateCountryInput
  ): Promise<ICountry> {
    const country = await (Country as any).findByIdAndUpdate(
      id,
      { ...input },
      { new: true, runValidators: true }
    );

    if (!country) {
      throw new Error("Country not found");
    }

    return country;
  }

  async deleteCountry(id: string): Promise<void> {
    const result = await (Country as any).findByIdAndDelete(id);
    if (!result) {
      throw new Error("Country not found");
    }
  }

  async getPopularCountries(limit: number = 10): Promise<ICountry[]> {
    // Get only Top countries (isTop: true), sorted by name
    return await (Country as any)
      .find({ isTop: true })
      .sort({ name: 1 })
      .limit(limit);
  }

  async searchCountries(searchTerm: string): Promise<ICountry[]> {
    return await (Country as any)
      .find({
        name: { $regex: searchTerm, $options: "i" },
      })
      .sort({ isTop: -1, name: 1 });
  }

  async getTopCountries(): Promise<ICountry[]> {
    // Get all countries where isTop is true
    return await (Country as any).find({ isTop: true }).sort({ name: 1 });
  }

  async getCountriesWithTours(): Promise<ICountry[]> {
    // 1. Get IDs of all countries that have at least one PUBLISHED tour
    const countryIds = await Tour.distinct("destination", {
      status: "PUBLISHED",
    });

    // 2. Fetch those countries
    return await (Country as any)
      .find({ _id: { $in: countryIds } })
      .sort({ name: 1 });
  }

  async getCountriesWithVisas(): Promise<ICountry[]> {
    // 1. Get names of all countries that have an active visa entry
    const visaCountryNames = await CountryVisa.distinct("countryName", {
      isActive: true,
    });

    // 2. Fetch those countries from the Country collection
    return await (Country as any)
      .find({ name: { $in: visaCountryNames } })
      .sort({ name: 1 });
  }
}

export default new CountryService();
