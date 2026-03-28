import { Banner } from "../../models/banner.model";
import { Blog } from "../../models/blogs.model";
import { Contact } from "../../models/contact.model";
import { CorporateClient } from "../../models/corporateClients.model";
import { CustomTourQuery } from "../../models/customTourQuery.model";
import { Faq } from "../../models/faq.model";
import { Image } from "../../models/gallery.model";
import { Query } from "../../models/query.model";
import Review from "../../models/review.model";
import { Team } from "../../models/team.model";
import { Tour } from "../../models/tour.model";
import { CountryVisa } from "../../models/visas.model";
import { Booking } from "../../models/booking.model";
import { VisaBookingQuery } from "../../models/visaBookingQuery.model";
import User from "../auth/auth.model";

export const DashboardService = {
  getDashboardStats: async () => {
    try {
      // Calculate date for "recent" (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get all counts in parallel for better performance
      const [
        totalUsers,
        recentUsers,
        totalQueries,
        recentQueries,
        totalReviews,
        recentReviews,
        totalBlogs,
        recentBlogs,
        totalTeam,
        recentTeam,
        totalContacts,
        recentContacts,
        totalVisas,
        recentVisas,
        totalGalleryImages,
        recentGalleryImages,
        totalBanners,
        totalTours,
        recentTours,
        totalFaqs,
        activeFaqs,
        totalCorporateClients,
        recentCorporateClients,
        totalCustomTourQueries,
        recentCustomTourQueries,
      ] = await Promise.all([
        // Users
        User.countDocuments(),
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Queries
        Query.countDocuments(),
        Query.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Reviews
        Review.countDocuments(),
        Review.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Blogs
        Blog.countDocuments(),
        Blog.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Team
        Team.countDocuments(),
        Team.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Contacts
        Contact.countDocuments(),
        Contact.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Visas
        CountryVisa.countDocuments(),
        CountryVisa.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Gallery
        Image.countDocuments(),
        Image.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Banners
        Banner.countDocuments(),

        // Tours
        Tour.countDocuments(),
        Tour.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // FAQs
        Faq.countDocuments(),
        Faq.countDocuments({ isActive: true }),

        // Corporate Clients
        CorporateClient.countDocuments(),
        CorporateClient.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),

        // Custom Tour Queries
        CustomTourQuery.countDocuments(),
        CustomTourQuery.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
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
    } catch (error) {
      throw error;
    }
  },

  getUserDashboardStats: async (userId: string) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const email = user.email.trim().toLowerCase();
      const emailRegex = {
        $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      };

      const [bookingsCount, queriesCount, visaQueriesCount] = await Promise.all(
        [
          Booking.countDocuments({
            $or: [{ userId }, { email: emailRegex }],
          }),
          Query.countDocuments({ email: emailRegex }),
          VisaBookingQuery.countDocuments({ email: emailRegex }),
        ]
      );

      const [pendingBookings, confirmedBookings, pendingVisaQueries] =
        await Promise.all([
          Booking.countDocuments({
            $or: [{ userId }, { email: emailRegex }],
            bookingStatus: "pending",
          }),
          Booking.countDocuments({
            $or: [{ userId }, { email: emailRegex }],
            bookingStatus: "confirmed",
          }),
          VisaBookingQuery.countDocuments({
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
    } catch (error) {
      throw error;
    }
  },
};
