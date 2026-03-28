export declare const DashboardService: {
    getDashboardStats: () => Promise<{
        users: {
            total: number;
            recent: number;
        };
        queries: {
            total: number;
            recent: number;
        };
        reviews: {
            total: number;
            recent: number;
        };
        blogs: {
            total: number;
            recent: number;
        };
        team: {
            total: number;
            recent: number;
        };
        contacts: {
            total: number;
            recent: number;
        };
        visas: {
            total: number;
            recent: number;
        };
        gallery: {
            total: number;
            recent: number;
        };
        banners: {
            total: number;
        };
        tours: {
            total: number;
            recent: number;
        };
        faqs: {
            total: number;
            active: number;
        };
        corporateClients: {
            total: number;
            recent: number;
        };
        customTourQueries: {
            total: number;
            recent: number;
        };
    }>;
    getUserDashboardStats: (userId: string) => Promise<{
        bookings: {
            total: number;
            pending: number;
            confirmed: number;
        };
        queries: {
            total: number;
        };
        visaQueries: {
            total: number;
            pending: number;
        };
    }>;
};
//# sourceMappingURL=dashboard.service.d.ts.map