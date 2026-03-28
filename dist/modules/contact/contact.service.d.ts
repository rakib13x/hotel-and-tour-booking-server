import { IContact } from "../../models/contact.model";
export declare const ContactService: {
    sendMailAndSaveContact: (contactData: IContact) => Promise<IContact>;
    getAllContacts: (page?: number, limit?: number, sortBy?: string, sortOrder?: "asc" | "desc", search?: string) => Promise<{
        contacts: IContact[];
        totalContacts: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    }>;
    getContactById: (contactId: string) => Promise<IContact>;
    deleteContactById: (contactId: string) => Promise<void>;
    getContactStats: () => Promise<{
        totalContacts: number;
        todayContacts: number;
        weekContacts: number;
        monthContacts: number;
    }>;
};
//# sourceMappingURL=contact.service.d.ts.map