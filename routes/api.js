import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { pb } from "../services/pocketbase.js";
import { logger } from "../services/logger.js";

const router = express.Router();

// Fetch all entries from a collection
router.get("/api/:collection", isAuthenticated, async (req, res) => {
  try {
    const records = await pb.collection(req.params.collection).getFullList();
    res.status(200).json(records);
  } catch (error) {
    logger.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Add a new entry to a collection
router.post("/api/:collection", isAuthenticated, async (req, res) => {
  try {
    const record = await pb.collection(req.params.collection).create(req.body);
    res.status(201).json(record);
  } catch (error) {
    logger.error("Error posting data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update an existing entry in a collection
router.put("/api/:collection/:id", isAuthenticated, async (req, res) => {
  try {
    const updatedRecord = await pb
      .collection(req.params.collection)
      .update(req.params.id, req.body);
    res.status(200).json(updatedRecord);
  } catch (error) {
    logger.error("Error updating data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an entry from a collection
router.delete("/api/:collection/:id", isAuthenticated, async (req, res) => {
  try {
    await pb.collection(req.params.collection).delete(req.params.id);
    res.status(200).json({ message: "Record deleted successfully." });
  } catch (error) {
    logger.error("Error deleting data:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
