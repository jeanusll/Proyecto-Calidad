import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.js";

import {
  createChat,
  getMessages,
  sendMessage,
  addUserToChat,
} from "../controllers/chat.controller.js";

const router = Router();

const chatUpload = upload("chat", false);

router.post("/sendMessage/:id", auth, sendMessage);
router.get("/:id", auth, getMessages);
router.post("/", auth, chatUpload.single("media"), createChat);
router.put("/addUser/:id", auth, addUserToChat);

export default router;
