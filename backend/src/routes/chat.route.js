import express from "express";
import {
  muteChat,
  unmuteChat,
  archiveChat,
  unarchiveChat,
  getChatSettings,
} from "../controllers/chat.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.post("/mute", muteChat);
router.post("/unmute", unmuteChat);
router.post("/archive", archiveChat);
router.post("/unarchive", unarchiveChat);
router.get("/settings", getChatSettings);

export default router;
