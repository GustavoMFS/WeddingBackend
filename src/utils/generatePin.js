import Invite from "../models/Invite.js";

export async function generateUniquePin() {
  let pin;
  let exists = true;

  while (exists) {
    pin = Math.floor(100000 + Math.random() * 900000).toString();

    exists = await Invite.exists({ pin });
  }

  return pin;
}
