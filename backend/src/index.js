import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    await connectDB();

    const port = Number(process.env.PORT) || 4000;

    const server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    server.on("error", (error) => {
      console.error("Server error:", error.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
};

startServer();