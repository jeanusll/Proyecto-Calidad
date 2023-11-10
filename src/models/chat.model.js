import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    imageGroup: {
      type: String,
    },
    nameOfGroup: {
      type: String,
      required: true,
    },
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
    },
    messagues: {
      type: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          dateOfSend: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    verifyTokenUser: true,
  }
);

export default mongoose.model("Chat", chatSchema);
