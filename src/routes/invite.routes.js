import express from "express";
import {
  createInvite,
  getInvitesByUser,
  addGuestToInvite,
  getGuestsByInvite,
  updateInvite,
  deleteInvite,
} from "../controllers/invite.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.post("/", verifyAdmin, createInvite);
router.get("/", verifyAdmin, getInvitesByUser);
router.post("/:inviteId/guests", verifyAdmin, addGuestToInvite);
router.get("/:inviteId/guests", verifyAdmin, getGuestsByInvite);
router.put("/:inviteId", verifyAdmin, updateInvite);
router.delete("/:inviteId", verifyAdmin, deleteInvite);

export default router;
