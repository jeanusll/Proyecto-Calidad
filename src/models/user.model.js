import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    biography: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
      enum: ["male", "female", "other"],
    },
    avatar: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    money: {
      type: Number,
      default: 0,
    },
    preferences: {
      type: [
        {
          category: {
            type: String,
            required: true,
          },
          score: {
            type: Number,
            required: true,
            default: 0.6,
          },
        },
      ],
      required: true,
    },

    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    notifications: {
      type: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          read: {
            type: Boolean,
            default: false,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    posts: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      ],
      default: [],
    },
    groupChats: {
      type: [
        {
          imageGroup: {
            type: String,
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
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
