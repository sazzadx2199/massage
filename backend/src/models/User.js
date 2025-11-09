import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    bio: {
      type: String,
      maxlength: 70,
      default: "",
    },
    // Muted chats
    mutedChats: [{
      chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      mutedUntil: {
        type: Date,
      },
      muteDuration: {
        type: String,
        enum: ["8h", "1w", "always"],
        default: "always",
      },
    }],
    // Archived chats
    archivedChats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  { timestamps: true } // createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
