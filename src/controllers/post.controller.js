import Post from "../models/post.model.js";
import { verifyToken } from "../libs/verifyToken.js";
export const getAllPosts = async (req, res) => {

  
  const page = req.params.page;
  const perPage = 50;

  try {
    
    const posts = await Post.find()
    .limit(perPage)
    .skip((page-1)* perPage)
    
    console.log(page-1)
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

    const paths = req.file.path.split("\\").slice(-3);
    const path = "/media/"+paths[0] + paths[1] + "/" + paths[2];

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

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const { token } = req.cookies;

  try {
    const user = await verifyToken(token);
    if (!user) return res.json({ error: "No se ha encontrado al usuario" });

    const commentObj = {
      user: user.id,
      text: comment,
    };

    const postUpdated = await Post.findByIdAndUpdate(id, {
      $push: {
        comments: commentObj,
      },
    })
      .populate("user", "username")
      .populate("comments.user", "commentUser");

    if (!postUpdated)
      return res.status(404).json({ error: "No se ha encontrado el post" });

    
    res.json(postUpdated);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
};

export const addReaction = async (req, res) => {
  const { id } = req.params;
  const { reaction } = req.body;
  const { token } = req.cookies;

  try {
    const user = await verifyToken(token);
    if (!user) return res.json({ error: "No se ha encontrado al usuario" });

    const reactionOBj = {
      user: user.id,
      reaction,
    };

    const postUpdated = await Post.findByIdAndUpdate(id, {
      $push: {
        reactions: reactionOBj,
      },
    });

    if (!postUpdated)
      return res.status(404).json({ error: "No se ha encontrado el post" });
    res.json(postUpdated);
  } catch (error) {}
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .populate("user", "username")
      .populate("comments.user", "commentUser");
    if (!post) {
      return res.status(404).json({ error: "No se ha encontrado el post" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
};
