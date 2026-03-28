import express from "express";
import adminRoutes from "../modules/admin/admin.routes";
import authRoutes from "../modules/auth/auth.routes";
import { AuthorizationRoutes } from "../modules/authorization/authorization.routes";
import { BannerRoutes } from "../modules/banner/banner.routes";
import { BlogRoutes } from "../modules/blogs/blogs.routes";
import bookingRoutes from "../modules/booking/booking.routes";
import { CompanyImagesRoutes } from "../modules/companyImages/companyImages.routes";
import { CompanyInfoRoutes } from "../modules/companyInfo/companyInfo.routes";
import { ContactRoutes } from "../modules/contact/contact.routes";
import { CorporateClientRoutes } from "../modules/corporateClients/corporateClients.routes";
import countryRoutes from "../modules/country/country.routes";
import customTourQueryRoutes from "../modules/customTourQuery/customTourQuery.routes";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { FaqRoutes } from "../modules/faq/faq.routes";
import { GalleryRoutes } from "../modules/gallery/gallery.routes";
import { PolicyPageRoutes } from "../modules/policyPage/policyPage.routes";
import productRoutes from "../modules/product/product.routes";
import { QueryRoutes } from "../modules/query/query.routes";
import { ReviewRoutes } from "../modules/review/review.routes";
import { TeamRoutes } from "../modules/team/team.routes";
import tourRoutes from "../modules/tour/tour.routes";
import tourCategoryRoutes from "../modules/tourCategory/tourCategory.routes";
import userRoutes from "../modules/user/user.routes";
import { CountryVisaRoutes } from "../modules/visa/visa.routes";
import visaBookingQueryRoutes from "../modules/visaBookingQuery/visaBookingQuery.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/company-info", CompanyInfoRoutes);
router.use("/company-images", CompanyImagesRoutes);
router.use("/admin", adminRoutes);
router.use("/dashboard", DashboardRoutes);
router.use("/tours", tourRoutes);
router.use("/tour-categories", tourCategoryRoutes);
router.use("/countries", countryRoutes);
router.use("/blogs", BlogRoutes);
router.use("/bookings", bookingRoutes);
router.use("/contact", ContactRoutes);
router.use("/reviews", ReviewRoutes);
router.use("/teams", TeamRoutes);
router.use("/banners", BannerRoutes);
router.use("/queries", QueryRoutes);
router.use("/custom-tour-queries", customTourQueryRoutes);
router.use("/visa-booking-queries", visaBookingQueryRoutes);
router.use("/visas", CountryVisaRoutes);
router.use("/gallery", GalleryRoutes);
router.use("/policy-pages", PolicyPageRoutes);
router.use("/authorizations", AuthorizationRoutes);
router.use("/faqs", FaqRoutes);
router.use("/corporate-clients", CorporateClientRoutes);

// TODO: add other module routes here

export default router;
