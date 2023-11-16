import { upload } from "../middlewares/multer.js";
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createChallenge } from "../controllers/challenge.controller.js";

const router = Router();

router.post("/", upload.single("media"), createChallenge);

export default router;
