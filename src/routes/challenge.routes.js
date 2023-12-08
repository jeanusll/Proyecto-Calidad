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

router.post("/", auth, challengesUpload.single("media"), createChallenge);
router.get("/all/:page", auth, getAllChallenges);
router.get("/:id", auth, getChallengeById);
router.put("/participate/:id", auth, participate);

export default router;
