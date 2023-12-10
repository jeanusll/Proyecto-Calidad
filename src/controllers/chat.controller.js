import { verifyToken } from "../libs/verifyToken.js";
import Chat from "../models/chat.model.js";
import { io } from "../app.js";

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const { token } = req.cookies;

    if (!token) return res.send(false);

    const userFound = await verifyToken(token);

    if (!userFound) return res.send(false);

    const newMessage = {
      sender: userFound.id,
      content: message,
    };

    const chat = await Chat.findByIdAndUpdate(id, {
      $push: { messages: newMessage },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    io.to(id).emit("newMessage", newMessage);

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
  const { nameOfGroup, userChat } = req.body;
  const { token } = req.cookies;

  // try {
    const userFound = await verifyToken(token);

    console.log()
    if (!req.file){
      return res.status(500).json({ error: "Hubo un problema al subir el archivo" });
    }
    if (!userFound)
      return res.status(404).json({ error: "Usuario no encontrado" }); 
    
    const pathImage = req.file.path.split('\\').slice(-4)
    const path = pathImage[0] + "/" + pathImage[1] + "/" + pathImage[2] + "/" + pathImage[3] + "/"
    console.log(pathImage)    

    var users = []
    users.push(userChat);
    users.push(userFound.id);
    
    const chat = new Chat({
      imageGroup: path,
      nameOfGroup,
      users,
    });

    const chatSaved = await chat.save();

    res.json(chatSaved);
  // } catch (err) {
  //   res.status(500).json({ error: "Error al crear el chat" });
  // }
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
