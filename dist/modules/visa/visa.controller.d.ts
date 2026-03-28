import { Request, Response } from "express";
export declare const CountryVisaController: {
    createCountryVisa: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAllCountryVisas: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getActiveCountryVisas: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getSingleCountryVisa: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountryVisaByCountryName: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountryVisasByVisaType: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCountryVisa: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCountryVisa: (req: Request, res: Response, next: import("express").NextFunction) => void;
    toggleCountryVisaStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=visa.controller.d.ts.map