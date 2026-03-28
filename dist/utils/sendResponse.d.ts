import { Response } from "express";
interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
    };
}
declare const sendResponse: (res: Response, statusCode: number, response: ApiResponse) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map