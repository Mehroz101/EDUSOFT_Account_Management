import { defineConfig } from "vite";
import { config } from "dotenv";

// Load environment variables from .env file
config();

export default defineConfig({
  // Your Vite configuration
  define: {
    "process.env": process.env,
  },
});
