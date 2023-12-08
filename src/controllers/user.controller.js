import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { verifyToken } from "../libs/verifyToken.js";
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
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted",
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

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, biography, gender, avatar, preferences } = req.body;

    const userUpdated = await User.findByIdAndUpdate(
      id,
      {
        fullname,
        biography,
        gender,
        avatar,
        preferences,
      },
      { new: true }
    );

    if (!userUpdated) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

async function isUserUnique(username, email) {
  let message = "";
  let status = true;
  const userFound = await User.findOne({ $or: [{ email }, { username }] });

  if (userFound) {
    status = false;
    if (userFound.email === email) message = "The email already exists";
    else {
      message = "The username already exists";
    }
  }

  return {
    status,
    message,
  };
}

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

    const isUnique = await isUserUnique(username, email);
    console.log(isUnique);
    if (!isUnique.status) {
      return res.json({
        message: isUnique.message,
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
      followers: userSaved.followers,
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
    if (!userFound.status) {
      return res.status(400).json({
        message: ["Account is locked. Please contact the administrator."],
      });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);


    if (!isMatch) {

      userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;
      await userFound.save();

      if (userFound.loginAttempts >= 3) {
        userFound.status = false;
        await userFound.save();
        return res.status(400).json({
          message: ["Too many login attempts. Account is now locked."],
        });
      }

      return res.status(400).json({
        message: ["The password is incorrect"],
      });
    }


    userFound.loginAttempts = 0;
    await userFound.save();

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

export const verifyTokenUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(500).json({ message: "No token provided" });

  try {
    const userFound = await verifyToken(token);

    if (!userFound)
      return res.status(500).json({ message: "Usuario no encontrado" });

    return res.json({
      id: userFound.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al verificar el token" });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const getChats = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(500).json({ message: "No token provided" });

  try {
    const userFound = await verifyToken(token);

    if (!userFound)
      return res.status(500).json({ message: "Usuario no encontrado" });

    const user = await User.findById(userFound.id);

    if (!user)
      return res.status(500).json({ message: "Usuario no encontrado" });

    const chats = user.chats;

    return res.json(chats);
  } catch (e) {
    return res.status(500).json({ error: "Error al obtener chats" });
  }
};
