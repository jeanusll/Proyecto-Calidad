import { Router } from "express";

import { auth } from "../middlewares/auth.middleware.js";
<<<<<<< HEAD
=======
import { validateSchema } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.js";
>>>>>>> 3afddf35055db68aed70a6e162698c633f2d754e

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
