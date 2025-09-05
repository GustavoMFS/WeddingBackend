import express from "express";
import {
  updateGuestStatus,
  updateGuest,
  deleteGuest,
} from "../controllers/guest.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.put("/admin/guests/:guestId/status", verifyAdmin, updateGuestStatus);
router.put("/public/guests/:guestId/status", updateGuestStatus);

router.put("/:inviteId/guests/:guestId", verifyAdmin, updateGuest);
router.delete("/:inviteId/guests/:guestId", verifyAdmin, deleteGuest);

export default router;
