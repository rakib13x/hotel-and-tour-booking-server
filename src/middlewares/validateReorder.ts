import { NextFunction, Request, Response } from "express";
import { reorderTeamsValidation } from "../modules/team/team.validation";

const validateReorder = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("=== REORDER VALIDATION DEBUG ===");
    console.log("URL:", req.url);
    console.log("Method:", req.method);
    console.log("Body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("=== END REORDER VALIDATION DEBUG ===");

    // Validate only the body for reorder endpoint
    const validatedData = reorderTeamsValidation.parse(req.body);

    // Update request with validated data
    req.body = validatedData;

    next();
  } catch (error: any) {
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

export default validateReorder;
