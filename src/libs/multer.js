import multer from "multer";
import fs from "fs-extra";
import { v4 } from "uuid";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolder = `media/${req.body.user}`;
    fs.ensureDir(userFolder)
      .then(() => {
        cb(null, userFolder);
      })
      .catch((err) => {
        cb(err, "media/");
      });
  },
  filename: function (req, file, cb) {
    const uniqueFileName = v4() + path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    const errorResponse = { error: "Tipo de archivo no admitido" };
    cb(null, false);
    cb(errorResponse);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
