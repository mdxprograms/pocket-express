import express from "express";
import { pb } from "../services/pocketbase.js";
import { logger } from "../services/logger.js";

const router = express.Router();

// Login route
router.get("/login", (req, res) => {
  res.render("user/login", {
    title: "Login",
    message: "Please log in to continue",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const authData = await pb.collection("users").authWithPassword(email, password);

    if (!authData || !authData.token || !authData.record) {
      throw new Error("Authentication failed: Missing data in response.");
    }

    req.session.token = authData.token;
    req.session.user = authData.record;

    logger.info(`User logged in successfully: ${authData.record.email}`);
    res.redirect("/");
  } catch (error) {
    logger.error("Error during login:", error.message || error);

    res.status(401).render("user/login", {
      title: "Login",
      message: "Invalid credentials. Please try again.",
    });
  }
});


// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error("Error during logout:", err);
      return res.status(500).json({ error: "Logout failed" });
    }
    logger.info("User logged out");
    res.redirect("/login");
  });
});

export default router;
