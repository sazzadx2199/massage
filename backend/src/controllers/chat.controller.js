import User from "../models/User.js";

// Mute chat
export const muteChat = async (req, res) => {
  try {
    const { chatId, duration } = req.body;
    const userId = req.user._id;

    let mutedUntil;
    if (duration === "8h") {
      mutedUntil = new Date(Date.now() + 8 * 60 * 60 * 1000);
    } else if (duration === "1w") {
      mutedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    } else {
      mutedUntil = new Date("2099-12-31"); // Always
    }

    const user = await User.findById(userId);
    
    // Remove if already muted
    user.mutedChats = user.mutedChats.filter(
      (mc) => mc.chatId.toString() !== chatId
    );

    // Add new mute
    user.mutedChats.push({
      chatId,
      mutedUntil,
      muteDuration: duration,
    });

    await user.save();

    res.status(200).json({ message: "Chat muted successfully" });
  } catch (error) {
    console.log("Error in muteChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unmute chat
export const unmuteChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.mutedChats = user.mutedChats.filter(
      (mc) => mc.chatId.toString() !== chatId
    );

    await user.save();

    res.status(200).json({ message: "Chat unmuted successfully" });
  } catch (error) {
    console.log("Error in unmuteChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Archive chat
export const archiveChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    if (!user.archivedChats.includes(chatId)) {
      user.archivedChats.push(chatId);
      await user.save();
    }

    res.status(200).json({ message: "Chat archived successfully" });
  } catch (error) {
    console.log("Error in archiveChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unarchive chat
export const unarchiveChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    user.archivedChats = user.archivedChats.filter(
      (id) => id.toString() !== chatId
    );

    await user.save();

    res.status(200).json({ message: "Chat unarchived successfully" });
  } catch (error) {
    console.log("Error in unarchiveChat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get muted and archived chats
export const getChatSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("mutedChats archivedChats");

    res.status(200).json({
      mutedChats: user.mutedChats,
      archivedChats: user.archivedChats,
    });
  } catch (error) {
    console.log("Error in getChatSettings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
