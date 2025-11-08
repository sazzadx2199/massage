import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  deleteMessage,
  editMessage,
  addReaction,
  removeReaction,
  markAsRead,
  togglePinMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);
router.put("/:id/read", markAsRead);
router.put("/:id/pin", togglePinMessage);
router.delete("/:id", deleteMessage);
router.put("/:id", editMessage);
router.post("/:id/reaction", addReaction);
router.delete("/:id/reaction", removeReaction);

export default router;
