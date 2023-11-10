import { Router } from "express";
import {
  getUserById,
  getuserByName,
  login,
  logout,
  register,
  updateUser,
  verifyTokenUser,
  deleteUser,
  updatePassword,
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyTokenUser);
router.post("/logout", logout);

router.get("/:id", auth, getUserById);
router.get("/findByName/:username", auth, getuserByName);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
router.patch("/updatePassword/:id", auth, updatePassword);

export default router;
