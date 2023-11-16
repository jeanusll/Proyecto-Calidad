import Challenge from "../models/challenge.model.js";
import { verifyToken } from "../libs/verifyToken.js";

export const createChallenge = async (req, res) => {
  const { tittle, category, description, earnedPoints, startDate, endDate } =
    req.body;

  const { token } = req.cookies;

  if (!token) return res.send(false);

  try {
    const userFound = await verifyToken(token);
    if (!userFound)
      return res.json({
        error: "No se ha encontrado al usuario",
      });
    if (!req.file) {
      return res.status(400).json({
        error: "No se ha seleccionado un archivo admitido",
      });
    }

    const paths = req.file.path.split("\\").slice(-2);
    const path = "/media/" + paths[0] + "/" + paths[1];

    const newChallenge = new Challenge({
      tittle,
      category,
      description,
      bannerPath: path,
      creator: userFound.id,
      earnedPoints,
      startDate,
      endDate,
    });

    const challengeSaved = await newChallenge.save();

    res.json(challengeSaved);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "ha ocurrido un error al subir el Challenge",
    });
  }
};

export const getAllChallenges = async (req, res) => {
  const page = req.params.page || 1;
  const perPage = 50;

  try {
    const challenges = await Challenge.aggregate([
      { $sample: { size: perPage } },
    ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator", "username");

    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los challenges" });
  }
};
