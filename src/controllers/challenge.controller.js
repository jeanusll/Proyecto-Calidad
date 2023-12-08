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

    const paths = req.file.path.split("\\").slice(-3);
    const path = "/media/"+paths[0] + paths[1] + "/" + paths[2];

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
    const challenges = await Challenge.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator", "username")
      .populate("participants", "username")
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los challenges" });
  }
};

export const getChallengeById = async (req, res) => {
  const { id } = req.params;
  try {
    const challenge = await Challenge.findById(id)
      .populate("creator", "username")
      .populate("participants", "username");

    if (!challenge) res.status(500).json({ error: "Challenge no encontrado" });

    res.json(challenge);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar el challenge" });
  }
};
export const participate = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;

  try {
    const userFound = await verifyToken(token);

    if (!userFound) {
      return res.status(500).json({ error: "No se ha encontrado el usuario" });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(500).json({ error: "Challenge no encontrado" });
    }

    if(challenge.participants.includes(userFound.id)) return res.status(500).json({"error": "Ya estás participando"})

    const dateNow = new Date();
    const endDate = new Date(challenge.endDate);

    if (dateNow > endDate) {
      return res.status(500).json({ error: "El Challenge ha terminado" });
    }

    challenge.participants.push(userFound.id);

    const challengeUpdate = await Challenge.findByIdAndUpdate(
      id,
      { participants: challenge.participants },
      { new: true }
    )
      .populate("creator", "username")
    .populate("participants", "username");

    if (!challengeUpdate) {
      return res
        .status(500)
        .json({ error: "Error al actualizar el Challenge" });
    }

    res.json(challengeUpdate);
  } catch (err) {
    res.status(500).json({
      error: "Error al participar en el Challenge",
    });
  }
};
