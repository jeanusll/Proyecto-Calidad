import multer from "multer";
import fs from "fs-extra";
import { v4 } from "uuid";
import path from "path";
import { verifyToken } from "../libs/verifyToken.js";
import { __dirname } from "../libs/dirname.js";

const storage = (type) =>
  multer.diskStorage({
    destination: async function (req, file, cb) {
      try {
        const { token } = req.cookies;

        if (!token) {
          return cb(new Error("Token no proporcionado"));
        }

        const userFound = await verifyToken(token);

        if (!userFound) {
          return cb(new Error("Token no válido"));
        }

        const userFolder = path.join(
          __dirname,
          "../public/media/",
          userFound.id.toString(),
          type
        );
        await fs.ensureDir(userFolder);
        cb(null, userFolder);
      } catch (err) {
        cb(err);
      }
    },
    filename: function (req, file, cb) {
      const uniqueFileName = v4() + path.extname(file.originalname);
      cb(null, uniqueFileName);
    },
  });

const fileFilter = (videoAccepted) => (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = (type, videoAccepted) =>
  multer({
    storage: storage(type),
    fileFilter: fileFilter(videoAccepted),
  });
