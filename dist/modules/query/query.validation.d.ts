import { z } from "zod";
export declare const QueryValidation: {
    createQueryValidation: z.ZodObject<{
        formType: z.ZodEnum<{
            hajj_umrah: "hajj_umrah";
            package_tour: "package_tour";
            group_ticket: "group_ticket";
        }>;
        name: z.ZodString;
        email: z.ZodString;
        contactNumber: z.ZodString;
        startingDate: z.ZodString;
        returnDate: z.ZodString;
        airlineTicketCategory: z.ZodEnum<{
            economy: "economy";
            business: "business";
            first_class: "first_class";
        }>;
        specialRequirements: z.ZodOptional<z.ZodString>;
        nightsStayMakkah: z.ZodOptional<z.ZodNumber>;
        nightsStayMadinah: z.ZodOptional<z.ZodNumber>;
        maleAdults: z.ZodOptional<z.ZodNumber>;
        femaleAdults: z.ZodOptional<z.ZodNumber>;
        childs: z.ZodOptional<z.ZodNumber>;
        accommodationType: z.ZodOptional<z.ZodEnum<{
            "2_star": "2_star";
            "3_star": "3_star";
            "4_star": "4_star";
            "5_star": "5_star";
        }>>;
        foodsIncluded: z.ZodOptional<z.ZodBoolean>;
        guideRequired: z.ZodOptional<z.ZodBoolean>;
        privateTransportation: z.ZodOptional<z.ZodBoolean>;
        visitingCountry: z.ZodOptional<z.ZodString>;
        visitingCities: z.ZodOptional<z.ZodString>;
        totalPassengers: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    getQueryByIdValidation: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    queryParamsValidation: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    getQueryWithParamsValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    deleteQueryWithParamsValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateQueryValidation: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            contacted: "contacted";
            closed: "closed";
            reviewed: "reviewed";
        }>>;
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        contactNumber: z.ZodOptional<z.ZodString>;
        specialRequirements: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateQueryWithParamsValidation: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<{
                pending: "pending";
                contacted: "contacted";
                closed: "closed";
                reviewed: "reviewed";
            }>>;
            name: z.ZodOptional<z.ZodString>;
            email: z.ZodOptional<z.ZodString>;
            contactNumber: z.ZodOptional<z.ZodString>;
            specialRequirements: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getAllQueriesValidation: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        sortBy: z.ZodOptional<z.ZodString>;
        sortOrder: z.ZodOptional<z.ZodEnum<{
            asc: "asc";
            desc: "desc";
        }>>;
        search: z.ZodOptional<z.ZodString>;
        formType: z.ZodOptional<z.ZodEnum<{
            hajj_umrah: "hajj_umrah";
            package_tour: "package_tour";
            group_ticket: "group_ticket";
        }>>;
        status: z.ZodOptional<z.ZodEnum<{
            pending: "pending";
            contacted: "contacted";
            closed: "closed";
            reviewed: "reviewed";
        }>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=query.validation.d.ts.map