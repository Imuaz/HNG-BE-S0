// Route handler for the /me endpoint
import express from "express";
import { getProfile } from "../controllers/routesController.js";

const router = express.Router();

/**
 * GET /me endpoint
 * Returns user profile information along with a random cat fact
 */
router.get('/me', getProfile);

export default router;