import { Document } from "mongoose";
export interface ITeam extends Document {
    name: string;
    designation: string;
    image: string;
    order?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITeamCreate {
    name: string;
    designation: string;
    image: string;
    order?: number;
}
export interface ITeamUpdate {
    name?: string;
    designation?: string;
    image?: string;
}
//# sourceMappingURL=team.interface.d.ts.map