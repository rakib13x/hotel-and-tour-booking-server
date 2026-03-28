import mongoose from "mongoose";
import { ITeam } from "../modules/team/team.interface";
export declare const Team: mongoose.Model<ITeam, {}, {}, {}, mongoose.Document<unknown, {}, ITeam, {}, {}> & ITeam & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=team.model.d.ts.map