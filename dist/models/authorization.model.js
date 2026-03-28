"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorization = void 0;
const mongoose_1 = require("mongoose");
const authorizationSchema = new mongoose_1.Schema({
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.Authorization = (0, mongoose_1.model)("Authorization", authorizationSchema);
//# sourceMappingURL=authorization.model.js.map