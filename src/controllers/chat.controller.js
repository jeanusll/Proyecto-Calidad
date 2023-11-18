import { verifyToken } from "../libs/verifyToken.js";
import Chat from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const { token } = req.cookies;

    if (!token) return res.send(false);

    const userFound = await verifyToken(token);

    if (!userFound) return res.send(false);

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    console.log(userFound.id)

    const newMessage = {
      sender: userFound.id,
      content: message,
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json({
      newMessage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Ha ocurrido un error al mandar el mensaje",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    
    
    const { id } = req.params;
    const { token } = req.cookies;
    const currentUser = await verifyToken(token)

    if (!currentUser) return res.status(500).json({ error: "No se encontró al usuario" })

    const groupChat = await Chat.findById(id).populate({
      path: "messages.sender",
      select: "username",
    });

    if (!groupChat.users.includes(currentUser.id)) return res.status(404).json({error: "No Autorizado"})

    if (!groupChat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      chat: groupChat.messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};

export const createChat = async (req, res) => {
  const { nameOfGroup, users } = req.body;
  const { token } = req.cookies;
  
  if (!req.file) {
    return res.json({
      error: "No se ha seleccionado un archivo admitido",
    })
  }
    const paths = req.file.path.split("\\").slice(-3);
    const path = "/media/"+paths[0]+"/" + paths[1] + "/" + paths[2];
    
  const currentUser = await verifyToken(token)
  if (!currentUser) return res.status(500).json({error: "No se encontró al usuario"})
  
  
  const usersGroup = users.split(",")
  
  usersGroup.push(currentUser.id)
  const newChat = new Chat({
    nameOfGroup,
    users: usersGroup,
    imageGroup: path,
  });

  const chatSaved = await newChat.save();

  res.json(chatSaved);
};

export const addUserToChat = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  const { token } = req.cookies;

  try {
    const userFound = await verifyToken(token);

    if (!userFound) {
      return res.status(500).json({ error: "Usuario no encontrrado" });
    }

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(500).json({ error: "Chat no encontrado" });
    }

    if (!chat.users.includes(userFound.id)) {
      return res
        .status(500)
        .json({ error: "No puedes agregar por que no pertences al chat" });
    }

    if (chat.users.includes(user_id)) {
      return res.status(500).json({ error: "El usuario ya pertenece al chat" });
    }

    const chatUpdated = await Chat.findByIdAndUpdate(id, {
      $push: {
        users: user_id,
      },
    });

    res.json(chatUpdated);
  } catch (err) {
    res.status(500).json({ error: "Error al añadir el usuario al chat" });
  }
};
