import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../modules/auth/auth.model";
import config from "./env";

// Serialize user to session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: `${
        process.env.API_URL || "http://localhost:5001"
      }/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return user
          return done(null, user as any);
        }

        // Check if user exists with the same email
        user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.profileImg =
            user.profileImg || profile.photos?.[0]?.value || null;
          await user.save();
          return done(null, user as any);
        }

        // Create new user
        const newUser = new User({
          // googleId: profile.id,
          email: profile.emails?.[0]?.value,
          name: profile.displayName,
          profileImg: profile.photos?.[0]?.value || null,
        });

        await newUser.save();
        return done(null, newUser as any);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
