"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const banner_model_1 = require("../../models/banner.model");
const blogs_model_1 = require("../../models/blogs.model");
const contact_model_1 = require("../../models/contact.model");
const corporateClients_model_1 = require("../../models/corporateClients.model");
const customTourQuery_model_1 = require("../../models/customTourQuery.model");
const faq_model_1 = require("../../models/faq.model");
const gallery_model_1 = require("../../models/gallery.model");
const query_model_1 = require("../../models/query.model");
const review_model_1 = __importDefault(require("../../models/review.model"));
const team_model_1 = require("../../models/team.model");
const tour_model_1 = require("../../models/tour.model");
const visas_model_1 = require("../../models/visas.model");
const booking_model_1 = require("../../models/booking.model");
const visaBookingQuery_model_1 = require("../../models/visaBookingQuery.model");
const auth_model_1 = __importDefault(require("../auth/auth.model"));
exports.DashboardService = {
    getDashboardStats: async () => {
        try {
            // Calculate date for "recent" (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            // Get all counts in parallel for better performance
            const [totalUsers, recentUsers, totalQueries, recentQueries, totalReviews, recentReviews, totalBlogs, recentBlogs, totalTeam, recentTeam, totalContacts, recentContacts, totalVisas, recentVisas, totalGalleryImages, recentGalleryImages, totalBanners, totalTours, recentTours, totalFaqs, activeFaqs, totalCorporateClients, recentCorporateClients, totalCustomTourQueries, recentCustomTourQueries,] = await Promise.all([
                // Users
                auth_model_1.default.countDocuments(),
                auth_model_1.default.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Queries
                query_model_1.Query.countDocuments(),
                query_model_1.Query.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Reviews
                review_model_1.default.countDocuments(),
                review_model_1.default.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Blogs
                blogs_model_1.Blog.countDocuments(),
                blogs_model_1.Blog.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Team
                team_model_1.Team.countDocuments(),
                team_model_1.Team.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Contacts
                contact_model_1.Contact.countDocuments(),
                contact_model_1.Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Visas
                visas_model_1.CountryVisa.countDocuments(),
                visas_model_1.CountryVisa.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Gallery
                gallery_model_1.Image.countDocuments(),
                gallery_model_1.Image.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Banners
                banner_model_1.Banner.countDocuments(),
                // Tours
                tour_model_1.Tour.countDocuments(),
                tour_model_1.Tour.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // FAQs
                faq_model_1.Faq.countDocuments(),
                faq_model_1.Faq.countDocuments({ isActive: true }),
                // Corporate Clients
                corporateClients_model_1.CorporateClient.countDocuments(),
                corporateClients_model_1.CorporateClient.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
                // Custom Tour Queries
                customTourQuery_model_1.CustomTourQuery.countDocuments(),
                customTourQuery_model_1.CustomTourQuery.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            ]);
            return {
                users: {
                    total: totalUsers,
                    recent: recentUsers,
                },
                queries: {
                    total: totalQueries,
                    recent: recentQueries,
                },
                reviews: {
                    total: totalReviews,
                    recent: recentReviews,
                },
                blogs: {
                    total: totalBlogs,
                    recent: recentBlogs,
                },
                team: {
                    total: totalTeam,
                    recent: recentTeam,
                },
                contacts: {
                    total: totalContacts,
                    recent: recentContacts,
                },
                visas: {
                    total: totalVisas,
                    recent: recentVisas,
                },
                gallery: {
                    total: totalGalleryImages,
                    recent: recentGalleryImages,
                },
                banners: {
                    total: totalBanners,
                },
                tours: {
                    total: totalTours,
                    recent: recentTours,
                },
                faqs: {
                    total: totalFaqs,
                    active: activeFaqs,
                },
                corporateClients: {
                    total: totalCorporateClients,
                    recent: recentCorporateClients,
                },
                customTourQueries: {
                    total: totalCustomTourQueries,
                    recent: recentCustomTourQueries,
                },
            };
        }
        catch (error) {
            throw error;
        }
    },
    getUserDashboardStats: async (userId) => {
        try {
            const user = await auth_model_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const email = user.email.trim().toLowerCase();
            const emailRegex = {
                $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                $options: "i",
            };
            const [bookingsCount, queriesCount, visaQueriesCount] = await Promise.all([
                booking_model_1.Booking.countDocuments({
                    $or: [{ userId }, { email: emailRegex }],
                }),
                query_model_1.Query.countDocuments({ email: emailRegex }),
                visaBookingQuery_model_1.VisaBookingQuery.countDocuments({ email: emailRegex }),
            ]);
            const [pendingBookings, confirmedBookings, pendingVisaQueries] = await Promise.all([
                booking_model_1.Booking.countDocuments({
                    $or: [{ userId }, { email: emailRegex }],
                    bookingStatus: "pending",
                }),
                booking_model_1.Booking.countDocuments({
                    $or: [{ userId }, { email: emailRegex }],
                    bookingStatus: "confirmed",
                }),
                visaBookingQuery_model_1.VisaBookingQuery.countDocuments({
                    email: emailRegex,
                    status: "pending",
                }),
            ]);
            return {
                bookings: {
                    total: bookingsCount,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                },
                queries: {
                    total: queriesCount,
                },
                visaQueries: {
                    total: visaQueriesCount,
                    pending: pendingVisaQueries,
                },
            };
        }
        catch (error) {
            throw error;
        }
    },
};
//# sourceMappingURL=dashboard.service.js.map