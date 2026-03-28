import { ITeam, ITeamCreate, ITeamUpdate } from "./team.interface";
export declare const TeamService: {
    createTeam: (teamData: ITeamCreate) => Promise<ITeam>;
    getAllTeams: (query: any) => Promise<{
        teams: (import("mongoose").Document<unknown, {}, ITeam, {}, {}> & ITeam & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getTeamById: (id: string) => Promise<ITeam | null>;
    updateTeam: (id: string, updateData: ITeamUpdate) => Promise<ITeam | null>;
    deleteTeam: (id: string) => Promise<ITeam | null>;
    uploadTeamImage: (file: Express.Multer.File) => Promise<string>;
    reorderTeams: (teamIds: string[]) => Promise<ITeam[]>;
};
//# sourceMappingURL=team.service.d.ts.map