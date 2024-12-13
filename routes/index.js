import express from "express";
import authRoutes from "./auth.js";
import apiRoutes from "./api.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.render("index", { title: "Pocket Express" });
});

router.use(authRoutes);
router.use(apiRoutes);

export default router;
