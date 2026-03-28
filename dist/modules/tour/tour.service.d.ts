import { IDestination } from "../../models/destination.model";
import { ITour } from "../../models/tour.model";
import { PaginationOptions, PaginationResult } from "../../utils/pagination";
interface CreateTourInput {
    code: string;
    title: string;
    destination: string;
    duration: {
        days: number;
        nights: number;
    };
    category: string;
    tags?: string[];
    highlights?: string[];
    inclusion?: string[];
    exclusion?: string[];
    visaRequirements?: string;
    terms?: string;
    otherDetails?: string;
    coverImageUrl?: string;
    coverImageId?: string;
    galleryUrls?: string[];
    galleryIds?: string[];
    basePrice: number;
    bookingFeePercentage: number;
    offer?: {
        isActive: boolean;
        discountType: "flat" | "percentage";
        flatDiscount?: number;
        discountPercentage?: number;
        label?: string;
    };
    itinerary?: any[];
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}
interface UpdateTourInput extends Partial<CreateTourInput> {
    publishedAt?: Date;
}
interface GetToursQuery extends PaginationOptions {
    destination?: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
}
declare class TourService {
    createTour(input: CreateTourInput): Promise<ITour>;
    getTours(query: GetToursQuery): Promise<PaginationResult<ITour>>;
    getTourById(id: string): Promise<ITour>;
    updateTour(id: string, input: UpdateTourInput): Promise<ITour>;
    deleteTour(id: string): Promise<void>;
    getRecommendedTours(limit?: number): Promise<ITour[]>;
    getToursByDestination(destinationId: string, limit?: number): Promise<ITour[]>;
    getToursByCountry(countryId: string, limit?: number): Promise<ITour[]>;
    getToursWithOffers(limit?: number): Promise<ITour[]>;
    createDestination(input: {
        country: string;
        city?: string;
        slug: string;
    }): Promise<IDestination>;
    getDestinations(): Promise<IDestination[]>;
    getDestinationById(id: string): Promise<IDestination>;
    updateDestination(id: string, input: Partial<{
        country: string;
        city?: string;
        slug: string;
    }>): Promise<IDestination>;
    deleteDestination(id: string): Promise<void>;
}
declare const _default: TourService;
export default _default;
//# sourceMappingURL=tour.service.d.ts.map