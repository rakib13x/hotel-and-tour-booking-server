"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        default: null,
    },
    profileImg: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: false,
        minlength: 8,
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    status: {
        type: String,
        enum: ["active", "block", "deactive"],
        default: "active",
    },
    role: {
        type: String,
        enum: ["admin", "user", "super_admin"],
        default: "user",
    },
}, { timestamps: true });
// Password hashing + comparePassword method
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password)
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    next();
});
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.password);
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=auth.model.js.map