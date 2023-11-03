import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;

    await user.save();

    return res.status(200).json({
      message: "Password updated",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id, (error, user) => {
      if (error) {
        return res.status(500).json({
          message: error.message,
        });
      }
      return res.status(200).json({
        message: "User deleted",
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getuserByName = async (req, res) => {
  try {
    const { username } = req.params;
    const users = await User.find({ username: { $regex: username } });
    if (!users) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, biography, gender, avatar, preferences } = req.body;

    User.findByIdAndUpdate(
      id,
      {
        fullname,
        biography,
        gender,
        avatar,
        preferences,
      },
      { new: true },
      (error, user) => {
        if (error) {
          return res.status(500).json({
            message: error.message,
          });
        }
        return res.status(200).json({
          user,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      fullname,
      biography,
      gender,
      avatar,
      dateOfBirth,
      preferences,
    } = req.body;

    const userFound = await User.findOne({ $or: [{ email }, { username }] });

    let message = "";
    if (userFound) {
      if (userFound.email === email) message = "The email already exists";
      else {
        message = "The username already exists";
      }
      return res.status(400).json({
        message,
      });
    }

    const birthDay = new Date(dateOfBirth);

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      fullname,
      biography,
      gender,
      avatar,
      dateOfBirth: birthDay,
      preferences: preferences,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({
      id: userSaved._id,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      avatar: userSaved.avatar,
      notifications: userSaved.notifications,
      preferences: userSaved.preferences,
      money: userSaved.money,
      points: userSaved.points,
      followers: userFound.followers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (!userFound)
      return res.status(400).json({
        message: ["The email does not exist"],
      });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }

    const token = await createAccessToken({
      id: userFound._id,
      username: userFound.username,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound._id,
      username: userFound.username,
      avatar: userFound.avatar,
      notifications: userFound.notifications,
      preferences: userFound.preferences,
      money: userFound.money,
      points: userFound.points,
      followers: userFound.followers,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};