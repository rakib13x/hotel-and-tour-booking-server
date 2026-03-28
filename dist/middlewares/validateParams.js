"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateParams = (schema) => {
    return (req, res, next) => {
        try {
            // Validate route parameters
            if (req.params && Object.keys(req.params).length > 0) {
                req.params = schema.parse(req.params);
            }
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Parameter validation error',
                errors: error.errors || [error.message]
            });
        }
    };
};
exports.default = validateParams;
//# sourceMappingURL=validateParams.js.map