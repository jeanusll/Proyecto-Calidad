import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const verifyToken = async (token) => {
  try {
    const user = await jwt.verify(token, TOKEN_SECRET);
    const userFound = await User.findById(user.id);
    if (!userFound) return null;

    return {
      id: userFound._id,
    };
  } catch (error) {
    return null;
  }
};
