import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

import {
  createChat,
  getMessages,
  sendMessage,
  addUserToChat,
} from "../controllers/chat.controller.js";

const router = Router();

router.post("/sendMessage/:id", auth, sendMessage);
router.get("/:id", auth, getMessages);
router.post("/", auth, createChat);
router.put("/addUser/:id", auth, addUserToChat);

export default router;
