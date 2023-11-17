import { upload } from "../middlewares/multer.js";
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";

import {
  createPost,
  addComment,
  addReaction,
  getAllPosts,
  getPostById,
} from "../controllers/post.controller.js";

const router = Router();
const postUpload = upload("post", true);

router.post("/", postUpload.single("media"), createPost);

router.put("/react/:id", addReaction);
router.put("/comment/:id", addComment);

router.get("/all/:page", getAllPosts);
router.get("/:id", getPostById);

export default router;
