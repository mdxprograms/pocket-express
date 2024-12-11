// Import required modules
import express from "express";
import PocketBase from "pocketbase";
import dotenv from "dotenv";
import session from "express-session";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { createLogger, format, transports } from "winston";
import path from "path"; // For setting up Pug templates

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set Pug as the view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Create a Winston logger
const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
});

// Middleware to parse JSON
app.use(express.json());

// Enable compression
app.use(compression());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// Initialize PocketBase client
const pb = new PocketBase(process.env.POCKETHOST_BASE_URL);

// Route to render the home page using Pug
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    message: "Welcome to the Express and PocketHost App!",
  });
});

// Route to render the login page using Pug
app.get("/login", (req, res) => {
  res.render("user/login", {
    title: "Login",
    message: "Please log in to continue",
  });
});

// Route to handle login submission
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    req.session.token = authData.token;
    req.session.user = authData.user;

    logger.info(`User logged in: ${authData.user.email}`);
    res.redirect("/"); // Redirect to home page after successful login
  } catch (error) {
    logger.error("Error during login:", error);
    res
      .status(401)
      .render("user/login", {
        title: "Login",
        message: "Invalid credentials. Please try again.",
      });
  }
});

// Route to log out
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error during logout:", err);
      return res.status(500).json({ error: "Logout failed" });
    }

    logger.info("User logged out");
    res.redirect("/login"); // Redirect to login page after logout
  });
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.token) {
    pb.authStore.save(req.session.token, req.session.user);
    return next();
  }
  res.status(401).redirect("/login");
};

// Protected route to fetch all entries from a specific collection
app.get("/api/:collection", isAuthenticated, async (req, res) => {
  const { collection } = req.params;

  try {
    const records = await pb.collection(collection).getFullList();
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching data from PocketHost:", error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Protected route to add a new entry to a specific collection
app.post("/api/:collection", isAuthenticated, async (req, res) => {
  const { collection } = req.params;
  const data = req.body;

  try {
    const record = await pb.collection(collection).create(data);
    res.status(201).json(record);
  } catch (error) {
    logger.error("Error posting data to PocketHost:", error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Protected route to update an existing entry in a collection
app.put("/api/:collection/:id", isAuthenticated, async (req, res) => {
  const { collection, id } = req.params;
  const data = req.body;

  try {
    const updatedRecord = await pb.collection(collection).update(id, data);
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error("Error updating data in PocketHost:", error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Protected route to delete an entry from a collection
app.delete("/api/:collection/:id", isAuthenticated, async (req, res) => {
  const { collection, id } = req.params;

  try {
    await pb.collection(collection).delete(id);
    res.status(200).json({ message: "Record deleted successfully." });
  } catch (error) {
    logger.error("Error deleting data from PocketHost:", error);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// 404 route handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).render("404", { title: "404", message: "Page not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res
    .status(err.status || 500)
    .render("error", {
      title: "Error",
      message: err.message || "Internal Server Error",
    });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
