import { upload } from "../middlewares/multer.js";
import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  participate,
} from "../controllers/challenge.controller.js";

const router = Router();
const challengesUpload = upload("challenges", true);

router.post("/", challengesUpload.single("media"), createChallenge);
router.get("/all/:page", getAllChallenges);
router.get("/:id", getChallengeById);
router.put("/participate/:id", participate);

export default router;
