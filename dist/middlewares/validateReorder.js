"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const team_validation_1 = require("../modules/team/team.validation");
const validateReorder = (req, res, next) => {
    try {
        console.log("=== REORDER VALIDATION DEBUG ===");
        console.log("URL:", req.url);
        console.log("Method:", req.method);
        console.log("Body:", req.body);
        console.log("Content-Type:", req.headers["content-type"]);
        console.log("=== END REORDER VALIDATION DEBUG ===");
        // Validate only the body for reorder endpoint
        const validatedData = team_validation_1.reorderTeamsValidation.parse(req.body);
        // Update request with validated data
        req.body = validatedData;
        next();
    }
    catch (error) {
        console.log("=== REORDER VALIDATION ERROR ===");
        console.log("URL:", req.url);
        console.log("Method:", req.method);
        console.log("Body:", req.body);
        console.log("Error:", error);
        console.log("Error errors:", error.errors);
        console.log("=== END REORDER VALIDATION ERROR ===");
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors || [error.message],
        });
    }
};
exports.default = validateReorder;
//# sourceMappingURL=validateReorder.js.map