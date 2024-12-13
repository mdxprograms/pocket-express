import express from "express";
import session from "express-session";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import livereload from "livereload";
import { fileURLToPath } from "url";
import connectLivereload from "connect-livereload";
import { logger } from "./services/logger.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
  // Enable livereload middleware
  app.use(connectLivereload());

  // Create and start the LiveReload server
  const liveReloadServer = livereload.createServer({
    exts: ["pug", "css", "js", "html"], // File extensions to watch
    debug: true,                       // Enable debug logging
  });
  liveReloadServer.watch(path.join(__dirname, "public"));
  liveReloadServer.watch(path.join(__dirname, "views"));

  // Add a debug log for server connections
  liveReloadServer.server.once("connection", () => {
    console.log("LiveReload server connected!");
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

// Middleware setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

if (!isDevelopment) {
  app.use(compression());
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);
}


// Routes
app.use(routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});