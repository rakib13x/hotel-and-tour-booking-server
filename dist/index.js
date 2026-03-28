"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const env_1 = __importDefault(require("./config/env"));
const auth_service_1 = __importDefault(require("./modules/auth/auth.service"));
console.log("env.port checking", env_1.default.port);
const startServer = async () => {
    try {
        await (0, db_1.default)(env_1.default.mongoURI);
        // Create default admin if not exists
        await auth_service_1.default.createDefaultAdmin();
        app_1.default.listen(env_1.default.port, () => {
            console.log(`🚀 Server running on port ${env_1.default.port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
    }
};
startServer();
//# sourceMappingURL=index.js.map