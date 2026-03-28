"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, response) => {
    res.status(statusCode).json(response);
};
exports.default = sendResponse;
//# sourceMappingURL=sendResponse.js.map