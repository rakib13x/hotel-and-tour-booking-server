import { Request, Response } from "express";
declare class TourController {
    createTour: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTours: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getTourById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateTour: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteTour: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRecommendedTours: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getToursByDestination: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getToursByCountry: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getToursWithOffers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDestinations: (req: Request, res: Response, next: import("express").NextFunction) => void;
    createDestination: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getDestinationById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateDestination: (req: Request, res: Response, next: import("express").NextFunction) => void;
    deleteDestination: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
declare const _default: TourController;
export default _default;
//# sourceMappingURL=tour.controller.d.ts.map