import Chat from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const { token } = req.cookies;

    if (!token) return res.send(false);

    const userFound = verifyToken(token);

    if (!userFound) return res.send(false);

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

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
      message: "An error occurred",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id).populate({
      path: "messages.sender",
      select: "username",
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(200).json({
      chat,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};

export const createChat = async (req, res) => {
  const { imageGroup, nameOfGroup, users } = req.body;

  const newChat = new Chat({
    imageGroup,
    nameOfGroup,
    users,
  });

  const chatSaved = await newChat.save();

  res.json(chatSaved);
};
