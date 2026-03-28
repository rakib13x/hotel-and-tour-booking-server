import { Request, Response } from "express";
declare class CountryController {
    createCountry: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountries: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountryById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCountry: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteCountry: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getPopularCountries: (req: Request, res: Response, next: import("express").NextFunction) => void;
    searchCountries: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTopCountries: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountriesWithTours: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getCountriesWithVisas: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: CountryController;
export default _default;
//# sourceMappingURL=country.controller.d.ts.map