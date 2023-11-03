import { Router } from "express";
import {
  getUserById,
  getuserByName,
  login,
  logout,
  register,
  updateUser,
  verifyToken,
  deleteUser
} from "../controllers/user.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken);
router.post("/logout", verifyToken, logout);

router.get("/user/:id", verifyToken, getUserById);
router.post("/user/find", verifyToken, getuserByName);
router.put("/user", verifyToken, updateUser);
router.delete("/user", verifyToken, deleteUser);


export default router;
