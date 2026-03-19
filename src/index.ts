import app from "./app";
import connectDB from "./config/db";
import env from "./config/env";
import authService from "./modules/auth/auth.service";

console.log("env.port checking", env.port);

const startServer = async () => {
  try {
    await connectDB(env.mongoURI);

    // Create default admin if not exists
    await authService.createDefaultAdmin();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
