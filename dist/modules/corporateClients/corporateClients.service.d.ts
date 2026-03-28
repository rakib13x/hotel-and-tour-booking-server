import { ICorporateClient } from "../../models/corporateClients.model";
export declare const CorporateClientService: {
    createCorporateClientIntoDB: (payload: ICorporateClient) => Promise<ICorporateClient>;
    getAllCorporateClientsFromDB: (query: any) => Promise<(import("mongoose").Document<unknown, {}, ICorporateClient, {}, {}> & ICorporateClient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getSingleCorporateClientFromDB: (id: string) => Promise<ICorporateClient | null>;
    updateCorporateClientIntoDB: (id: string, payload: Partial<ICorporateClient>) => Promise<ICorporateClient | null>;
    deleteCorporateClientFromDB: (id: string) => Promise<ICorporateClient | null>;
    getPublicCorporateClientsFromDB: () => Promise<(import("mongoose").Document<unknown, {}, ICorporateClient, {}, {}> & ICorporateClient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    reorderCorporateClientsIntoDB: (clientIds: string[]) => Promise<(import("mongoose").Document<unknown, {}, ICorporateClient, {}, {}> & ICorporateClient & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=corporateClients.service.d.ts.map