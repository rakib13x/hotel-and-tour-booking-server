import { ICountry } from "../../models/Country";
import { PaginationResult } from "../../utils/pagination";
interface CreateCountryInput {
    name: string;
    imageUrl: string;
    isTop?: boolean;
}
interface UpdateCountryInput extends Partial<CreateCountryInput> {
}
interface GetCountriesQuery {
    page?: number;
    limit?: number;
    search?: string;
    isTop?: string | boolean;
}
declare class CountryService {
    createCountry(input: CreateCountryInput): Promise<ICountry>;
    getCountries(query: GetCountriesQuery): Promise<PaginationResult<ICountry>>;
    getCountryById(id: string): Promise<ICountry>;
    updateCountry(id: string, input: UpdateCountryInput): Promise<ICountry>;
    deleteCountry(id: string): Promise<void>;
    getPopularCountries(limit?: number): Promise<ICountry[]>;
    searchCountries(searchTerm: string): Promise<ICountry[]>;
    getTopCountries(): Promise<ICountry[]>;
    getCountriesWithTours(): Promise<ICountry[]>;
    getCountriesWithVisas(): Promise<ICountry[]>;
}
declare const _default: CountryService;
export default _default;
//# sourceMappingURL=country.service.d.ts.map