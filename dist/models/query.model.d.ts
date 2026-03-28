import mongoose from "mongoose";
export interface IQuery {
    _id?: string;
    formType: "hajj_umrah" | "package_tour" | "group_ticket";
    name: string;
    email: string;
    contactNumber: string;
    startingDate: Date;
    returnDate: Date;
    airlineTicketCategory: "economy" | "business" | "first_class";
    specialRequirements?: string;
    nightsStayMakkah?: number;
    nightsStayMadinah?: number;
    maleAdults?: number;
    femaleAdults?: number;
    childs?: number;
    accommodationType?: "2_star" | "3_star" | "4_star" | "5_star";
    foodsIncluded?: boolean;
    guideRequired?: boolean;
    privateTransportation?: boolean;
    visitingCountry?: string;
    visitingCities?: string;
    totalPassengers?: number;
    status: "pending" | "reviewed" | "contacted" | "closed";
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const Query: mongoose.Model<IQuery, {}, {}, {}, mongoose.Document<unknown, {}, IQuery, {}, {}> & IQuery & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=query.model.d.ts.map