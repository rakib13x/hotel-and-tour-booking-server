import { z } from "zod";
export declare const CountryVisaValidation: {
    createCountryVisaValidation: z.ZodObject<{
        body: z.ZodObject<{
            countryName: z.ZodString;
            visaTypes: z.ZodArray<z.ZodEnum<{
                "tourist visa": "tourist visa";
                "sticker visa": "sticker visa";
                "e-visa": "e-visa";
            }>>;
            processingFee: z.ZodOptional<z.ZodNumber>;
            required_document: z.ZodOptional<z.ZodString>;
            isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCountryVisaValidation: z.ZodObject<{
        body: z.ZodObject<{
            countryName: z.ZodOptional<z.ZodString>;
            visaTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                "tourist visa": "tourist visa";
                "sticker visa": "sticker visa";
                "e-visa": "e-visa";
            }>>>;
            processingFee: z.ZodOptional<z.ZodNumber>;
            required_document: z.ZodOptional<z.ZodString>;
            isActive: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSingleCountryVisaValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteCountryVisaValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getCountryVisaByCountryNameValidation: z.ZodObject<{
        params: z.ZodObject<{
            countryName: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getCountryVisasByVisaTypeValidation: z.ZodObject<{
        params: z.ZodObject<{
            visaType: z.ZodEnum<{
                "tourist visa": "tourist visa";
                "sticker visa": "sticker visa";
                "e-visa": "e-visa";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    toggleCountryVisaStatusValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            isActive: z.ZodBoolean;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=visa.validation.d.ts.map