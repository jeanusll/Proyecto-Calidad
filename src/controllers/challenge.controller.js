import Challenge from "../models/challenge.model";
import { verifyToken } from "../libs/verifyToken.js";

export const createChallenge = async (req, res) => {
    const {

        tittle,
        category,
        description,
        bannerPath,
        earnedPoints,
        startDate,
        endDate

    } = req.body

    const { token } = req.cookies;
    
    if (!token) return res.send(false);
    const userFound = verifyToken(token);
    if (!userFound) return res.send(false);
    if (!req.file) {
        return res.status(400).send("No se ha seleccionado ningún archivo.");
    }
    const newChallenge = new Challenge({
        tittle,
        category,
        description,
        bannerPath: req.file.path,
        creator: userFound.id,
        earnedPoints,
        startDate,
        endDate
    })

    const challengeSaved = await newChallenge.save();

    res.json(challengeSaved);
}

export const getAllChallenges = async (req, res) => {
    const page = req.params.page || 1;
    const perPage = 50;

    try {
        const challenges = await Challenge.aggregate([{ $sample: { size: perPage } }])
          .skip((page - 1) * perPage)
          .limit(perPage)
            .populate("creator", "username");
        
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los challenges" });
    }
}