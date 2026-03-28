import mongoose, { Types } from "mongoose";
declare const ItineraryDay: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    _id: false;
}, {
    title: string;
    dayNo: number;
    blocks: Types.DocumentArray<{
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }, Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }> & {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }>;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
    dayNo: number;
    blocks: Types.DocumentArray<{
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }, Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }> & {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }>;
}>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    _id: false;
}>> & mongoose.FlatRecord<{
    title: string;
    dayNo: number;
    blocks: Types.DocumentArray<{
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }, Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }> & {
        type: "TRANSFER" | "SIGHTSEEING" | "MEAL" | "HOTEL" | "NOTE";
        description?: string | null;
        title?: string | null;
        timeFrom?: string | null;
        timeTo?: string | null;
        subtitle?: string | null;
        meals?: {
            breakfast: boolean;
            lunch: boolean;
            dinner: boolean;
        } | null;
        hotelName?: string | null;
    }>;
}> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export interface ITour {
    _id: Types.ObjectId;
    code: string;
    title: string;
    destination: Types.ObjectId;
    duration: {
        days: number;
        nights: number;
    };
    category: Types.ObjectId;
    tags: string[];
    highlights: string[];
    inclusion: string[];
    exclusion: string[];
    visaRequirements?: string;
    terms?: string;
    otherDetails?: string;
    coverImageUrl?: string;
    coverImageId?: string;
    galleryUrls: string[];
    galleryIds: string[];
    basePrice: number;
    bookingFeePercentage: number;
    offer?: {
        isActive: boolean;
        discountType: "flat" | "percentage";
        flatDiscount?: number;
        discountPercentage?: number;
        label?: string;
    };
    itinerary: (typeof ItineraryDay)[];
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt?: Date;
}
export declare const Tour: mongoose.Model<ITour, {}, {}, {}, mongoose.Document<unknown, {}, ITour, {}, {}> & ITour & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=tour.model.d.ts.map