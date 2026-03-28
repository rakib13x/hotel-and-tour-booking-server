import { z } from "zod";
export declare const zCreateTour: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodString;
        title: z.ZodString;
        destination: z.ZodString;
        duration: z.ZodUnion<readonly [z.ZodObject<{
            days: z.ZodCoercedNumber<unknown>;
            nights: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>;
        category: z.ZodString;
        tags: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        highlights: z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        inclusion: z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        exclusion: z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        visaRequirements: z.ZodOptional<z.ZodString>;
        terms: z.ZodOptional<z.ZodString>;
        otherDetails: z.ZodOptional<z.ZodString>;
        coverImageUrl: z.ZodOptional<z.ZodString>;
        coverImageId: z.ZodOptional<z.ZodString>;
        galleryUrls: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        galleryIds: z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        basePrice: z.ZodCoercedNumber<unknown>;
        offer: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            isActive: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
            discountType: z.ZodEnum<{
                flat: "flat";
                percentage: "percentage";
            }>;
            flatDiscount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            discountPercentage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        itinerary: z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            dayNo: z.ZodNumber;
            title: z.ZodString;
            blocks: z.ZodDefault<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    TRANSFER: "TRANSFER";
                    SIGHTSEEING: "SIGHTSEEING";
                    MEAL: "MEAL";
                    HOTEL: "HOTEL";
                    NOTE: "NOTE";
                }>;
                title: z.ZodOptional<z.ZodString>;
                subtitle: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                timeFrom: z.ZodOptional<z.ZodString>;
                timeTo: z.ZodOptional<z.ZodString>;
                meals: z.ZodOptional<z.ZodObject<{
                    breakfast: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    lunch: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    dinner: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                }, z.core.$strip>>;
                hotelName: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        status: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            DRAFT: "DRAFT";
            PUBLISHED: "PUBLISHED";
            ARCHIVED: "ARCHIVED";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zUpdateTour: z.ZodObject<{
    body: z.ZodObject<{
        code: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        destination: z.ZodOptional<z.ZodString>;
        duration: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            days: z.ZodCoercedNumber<unknown>;
            nights: z.ZodCoercedNumber<unknown>;
        }, z.core.$strip>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>;
        category: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>>;
        highlights: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        inclusion: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        exclusion: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        visaRequirements: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        terms: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        otherDetails: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        coverImageUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        coverImageId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        galleryUrls: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>>;
        galleryIds: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodUnion<readonly [z.ZodArray<z.ZodString>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>>;
        basePrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
        offer: z.ZodOptional<z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
            isActive: z.ZodDefault<z.ZodCoercedBoolean<unknown>>;
            discountType: z.ZodEnum<{
                flat: "flat";
                percentage: "percentage";
            }>;
            flatDiscount: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            discountPercentage: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
            label: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        itinerary: z.ZodOptional<z.ZodDefault<z.ZodUnion<readonly [z.ZodArray<z.ZodObject<{
            dayNo: z.ZodNumber;
            title: z.ZodString;
            blocks: z.ZodDefault<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<{
                    TRANSFER: "TRANSFER";
                    SIGHTSEEING: "SIGHTSEEING";
                    MEAL: "MEAL";
                    HOTEL: "HOTEL";
                    NOTE: "NOTE";
                }>;
                title: z.ZodOptional<z.ZodString>;
                subtitle: z.ZodOptional<z.ZodString>;
                description: z.ZodOptional<z.ZodString>;
                timeFrom: z.ZodOptional<z.ZodString>;
                timeTo: z.ZodOptional<z.ZodString>;
                meals: z.ZodOptional<z.ZodObject<{
                    breakfast: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    lunch: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                    dinner: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
                }, z.core.$strip>>;
                hotelName: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>, z.ZodPipe<z.ZodString, z.ZodTransform<any, string>>]>>>;
        status: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            DRAFT: "DRAFT";
            PUBLISHED: "PUBLISHED";
            ARCHIVED: "ARCHIVED";
        }>>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const zGetTours: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sortBy: z.ZodDefault<z.ZodString>;
    sortOrder: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    search: z.ZodOptional<z.ZodString>;
    searchFields: z.ZodOptional<z.ZodString>;
    destination: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        PUBLISHED: "PUBLISHED";
        ARCHIVED: "ARCHIVED";
    }>>;
    category: z.ZodOptional<z.ZodString>;
    minPrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxPrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const zCreateDestination: z.ZodObject<{
    country: z.ZodString;
    city: z.ZodOptional<z.ZodString>;
    slug: z.ZodString;
}, z.core.$strip>;
export declare const zUpdateDestination: z.ZodObject<{
    country: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    slug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=tour.zod.d.ts.map