import { ICountryVisa } from "./visa.interface";
interface CreateCountryVisaInput {
    countryName: string;
    visaTypes: string[];
    processingFee?: number;
    required_document?: string;
    isActive?: boolean;
}
interface UpdateCountryVisaInput extends Partial<CreateCountryVisaInput> {
}
export declare const CountryVisaService: {
    createCountryVisaIntoDB: (payload: CreateCountryVisaInput) => Promise<ICountryVisa>;
    getAllCountryVisasFromDB: (query: Record<string, any>) => Promise<{
        data: (import("mongoose").Document<unknown, {}, ICountryVisa, {}, {}> & ICountryVisa & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getSingleCountryVisaFromDB: (id: string) => Promise<ICountryVisa | null>;
    getCountryVisaByCountryNameFromDB: (countryName: string) => Promise<ICountryVisa | null>;
    updateCountryVisaIntoDB: (id: string, payload: UpdateCountryVisaInput) => Promise<ICountryVisa | null>;
    deleteCountryVisaFromDB: (id: string) => Promise<ICountryVisa | null>;
    getActiveCountryVisasFromDB: () => Promise<ICountryVisa[]>;
    toggleCountryVisaStatusInDB: (id: string, isActive: boolean) => Promise<ICountryVisa | null>;
    getCountryVisasByVisaTypeFromDB: (visaType: string) => Promise<ICountryVisa[]>;
};
export {};
//# sourceMappingURL=visa.service.d.ts.map