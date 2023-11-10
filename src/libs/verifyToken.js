import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const verifyToken = (token) => {
  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return null;

    const userFound = await User.findById(user.id);

    if (!userFound) return null;

    return {
      id: userFound._id,
    };
  });
};
