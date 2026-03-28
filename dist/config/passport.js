"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_model_1 = __importDefault(require("../modules/auth/auth.model"));
const env_1 = __importDefault(require("./env"));
// Serialize user to session
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
// Deserialize user from session
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await auth_model_1.default.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
// Google OAuth Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.default.google.clientId,
    clientSecret: env_1.default.google.clientSecret,
    callbackURL: `${process.env.API_URL || "http://localhost:5001"}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await auth_model_1.default.findOne({ googleId: profile.id });
        if (user) {
            // User exists, return user
            return done(null, user);
        }
        // Check if user exists with the same email
        user = await auth_model_1.default.findOne({ email: profile.emails?.[0]?.value });
        if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            user.profileImg =
                user.profileImg || profile.photos?.[0]?.value || null;
            await user.save();
            return done(null, user);
        }
        // Create new user
        const newUser = new auth_model_1.default({
            // googleId: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            profileImg: profile.photos?.[0]?.value || null,
        });
        await newUser.save();
        return done(null, newUser);
    }
    catch (error) {
        return done(error, undefined);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map