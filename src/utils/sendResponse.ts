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

const sendResponse = (
  res: Response,
  statusCode: number,
  response: ApiResponse
) => {
  res.status(statusCode).json(response);
};

export default sendResponse;
