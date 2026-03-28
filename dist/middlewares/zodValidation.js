"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            // For form-data requests, validate the body directly
            // For other requests, wrap in the full request structure
            let dataToValidate;
            // Check if this is a form-data request (multipart/form-data)
            const contentType = req.headers["content-type"];
            if (contentType && contentType.includes("multipart/form-data")) {
                // For form-data, wrap in the full structure like JSON requests
                dataToValidate = {
                    params: req.params,
                    query: req.query,
                    body: req.body,
                };
                console.log("=== MULTIPART FORM-DATA VALIDATION ===");
                console.log("URL:", req.url);
                console.log("Content-Type:", contentType);
                console.log("Data to validate:", dataToValidate);
                console.log("Body keys:", Object.keys(req.body));
                console.log("Logo in body:", req.body.logo);
                console.log("Logo type:", typeof req.body.logo);
                console.log("subCategoryId in body:", req.body.subCategoryId);
                console.log("subCategoryId type:", typeof req.body.subCategoryId);
            }
            else {
                // For JSON requests, wrap in the full structure
                dataToValidate = {
                    params: req.params,
                    query: req.query,
                    body: req.body,
                };
                console.log("=== JSON VALIDATION ===");
                console.log("Data to validate:", dataToValidate);
            }
            console.log("Schema validation starting...");
            const validatedData = schema.parse(dataToValidate);
            console.log("Schema validation successful:", validatedData);
            // Update request with validated data
            req.params = validatedData.params || req.params;
            req.query = validatedData.query || req.query;
            req.body = validatedData.body || req.body;
            next();
        }
        catch (error) {
            console.log("=== VALIDATION ERROR ===");
            console.log("URL:", req.url);
            console.log("Method:", req.method);
            console.log("Content-Type:", req.headers["content-type"]);
            console.log("Params:", req.params);
            console.log("Body:", req.body);
            console.log("Query:", req.query);
            console.log("Error:", error);
            console.log("Error errors:", error.errors);
            console.log("=== END VALIDATION ERROR ===");
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors || [error.message],
            });
        }
    };
};
exports.default = validateRequest;
//# sourceMappingURL=zodValidation.js.map