import { Types } from "mongoose";
export interface IBlog {
    title: string;
    category: Types.ObjectId;
    coverImage?: string;
    images?: string[];
    content: string;
    tags: string[];
    readTime: string;
    status: "draft" | "published";
}
//# sourceMappingURL=blogs.interface.d.ts.map