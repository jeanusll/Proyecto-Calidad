import { upload } from "../middlewares/multer.js";
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";

import { createPost } from "../controllers/post.controller.js";

const router = Router();

router.post("/", upload.single("media"), createPost);
export default router;
