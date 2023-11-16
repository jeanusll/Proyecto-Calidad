import Post from "../models/post.model.js";
import { verifyToken } from "../libs/verifyToken.js";
export const getAllPosts = async (req, res) => {
  const page = req.params.page || 1;
  const perPage = 50;

  try {
    const posts = await Post.aggregate([{ $sample: { size: perPage } }])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("user", "username");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};

export const createPost = async (req, res) => {
  const { token } = req.cookies;
  const { description } = req.body;

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

    const newPost = new Post({
      user: userFound.id,
      description,
      mediapath: path,
    });

    const postSaved = await newPost.save();
    res.json(postSaved);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "ha ocurrido un error al subir el post",
    });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;

  const {} = req.body;
  try {
    const post = await Post.findById(id);
    const { token } = req.cookies;

    if (!token) return res.send(false);

    const userFound = verifyToken(token);

    if (!userFound) return res.send(false);

    if (userFound.id !== post.user) return res.status(404).send(false);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
};
