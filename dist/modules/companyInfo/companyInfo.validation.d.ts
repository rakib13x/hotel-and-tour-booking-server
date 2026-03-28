import { z } from "zod";
export declare const CompanyInfoValidation: {
    createCompanyInfoZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            companyName: z.ZodString;
            logo: z.ZodString;
            email: z.ZodArray<z.ZodString>;
            phone: z.ZodArray<z.ZodString>;
            address: z.ZodString;
            googleMapUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            description: z.ZodOptional<z.ZodString>;
            socialLinks: z.ZodOptional<z.ZodObject<{
                facebook: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                twitter: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                instagram: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                youtube: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                tiktok: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            }, z.core.$strip>>;
            youtube_video: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            yearsOfExperience: z.ZodNumber;
            openingHours: z.ZodString;
            close: z.ZodEnum<{
                Monday: "Monday";
                Tuesday: "Tuesday";
                Wednesday: "Wednesday";
                Thursday: "Thursday";
                Friday: "Friday";
                Saturday: "Saturday";
                Sunday: "Sunday";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateCompanyInfoZodSchema: z.ZodObject<{
        body: z.ZodObject<{
            companyName: z.ZodOptional<z.ZodString>;
            logo: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            email: z.ZodOptional<z.ZodArray<z.ZodString>>;
            phone: z.ZodOptional<z.ZodArray<z.ZodString>>;
            address: z.ZodOptional<z.ZodString>;
            googleMapUrl: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            description: z.ZodOptional<z.ZodString>;
            socialLinks: z.ZodOptional<z.ZodObject<{
                facebook: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                twitter: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                instagram: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                youtube: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
                tiktok: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            }, z.core.$strip>>;
            youtube_video: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            yearsOfExperience: z.ZodOptional<z.ZodNumber>;
            openingHours: z.ZodString;
            close: z.ZodEnum<{
                Monday: "Monday";
                Tuesday: "Tuesday";
                Wednesday: "Wednesday";
                Thursday: "Thursday";
                Friday: "Friday";
                Saturday: "Saturday";
                Sunday: "Sunday";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=companyInfo.validation.d.ts.map