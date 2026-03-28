import { z } from "zod";
export declare const CorporateClientValidation: {
    createCorporateClientValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            logo: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCorporateClientValidation: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            logo: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getSingleCorporateClientValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteCorporateClientValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    reorderCorporateClientsValidation: z.ZodObject<{
        body: z.ZodObject<{
            clientIds: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=corporateClients.validation.d.ts.map