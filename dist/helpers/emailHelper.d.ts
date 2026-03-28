interface ISendEmail {
    to: string;
    subject: string;
    html: string;
}
export declare const emailHelper: {
    sendEmail: (values: ISendEmail) => Promise<void>;
};
export {};
//# sourceMappingURL=emailHelper.d.ts.map