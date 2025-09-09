import express from "express";
import {
  createInvite,
  getInvitesByUser,
  addGuestToInvite,
  getGuestsByInvite,
  updateInvite,
  deleteInvite,
  getInviteByPin,
  updateGuestsConfirmation,
  updateInviteContact,
  getInviteContact,
} from "../controllers/invite.controller.js";
import { verifyAdmin } from "../middlewares/adminAuth.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyAdmin, createInvite);
router.get("/", verifyAdmin, getInvitesByUser);
router.post("/:inviteId/guests", verifyAdmin, addGuestToInvite);
router.get("/:inviteId/guests", verifyUser, getGuestsByInvite);
router.get("/:inviteId/guestsAdmin", verifyAdmin, getGuestsByInvite);
router.put("/:inviteId", verifyAdmin, updateInvite);
router.delete("/:inviteId", verifyAdmin, deleteInvite);
router.post("/validate-pin", getInviteByPin);
router.post("/:inviteId/guests/confirm", verifyUser, updateGuestsConfirmation);
router.put("/:inviteId/contact", verifyUser, updateInviteContact);
router.get("/:inviteId", verifyUser, getInviteContact);

export default router;
