import { z } from "zod";
export declare const createTeamValidation: z.ZodObject<{
    params: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    body: z.ZodObject<{
        name: z.ZodString;
        designation: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const createTeamWithUrlValidation: z.ZodObject<{
    name: z.ZodString;
    designation: z.ZodString;
    image: z.ZodString;
}, z.core.$strip>;
export declare const updateTeamValidation: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    designation: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateTeamWithImageValidation: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
    query: z.ZodOptional<z.ZodObject<{}, z.core.$strip>>;
    body: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        designation: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const idParamValidation: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const reorderTeamsValidation: z.ZodObject<{
    teamIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=team.validation.d.ts.map