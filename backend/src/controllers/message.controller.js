import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    
    // Get all users who have chatted with the logged-in user
    const messagesWithUsers = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    }).distinct('senderId receiverId');

    // Create a set of user IDs who have chatted
    const chattedUserIds = new Set(
      messagesWithUsers
        .flat()
        .map(id => id.toString())
        .filter(id => id !== loggedInUserId.toString())
    );

    // Get all users except logged-in user and those who have chatted
    const filteredUsers = await User.find({ 
      _id: { 
        $ne: loggedInUserId,
        $nin: Array.from(chattedUserIds)
      } 
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      deletedForEveryone: false,
    })
    .populate('replyTo', 'text image senderId')
    .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      // upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      replyTo: replyTo || null,
    });

    await newMessage.save();
    
    // Populate replyTo message for response
    await newMessage.populate('replyTo');

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      deletedForEveryone: false,
    }).sort({ createdAt: -1 });

    const chatPartnersMap = new Map();

    messages.forEach((msg) => {
      const partnerId = msg.senderId.toString() === loggedInUserId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString();

      if (!chatPartnersMap.has(partnerId)) {
        // Count unread messages (received by logged-in user and not read)
        const unreadCount = messages.filter(
          m => m.receiverId.toString() === loggedInUserId.toString() &&
               m.senderId.toString() === partnerId &&
               !m.isRead
        ).length;

        // Format last message text
        let lastMessage = "";
        if (msg.isCallMessage) {
          const callType = msg.callData.callType === "video" ? "Video call" : "Voice call";
          const isSender = msg.senderId.toString() === loggedInUserId.toString();
          
          switch (msg.callData.status) {
            case "missed":
              lastMessage = isSender ? `${callType} (No answer)` : `Missed ${callType.toLowerCase()}`;
              break;
            case "rejected":
              lastMessage = isSender ? `${callType} (Declined)` : `Declined ${callType.toLowerCase()}`;
              break;
            case "completed":
              lastMessage = `${callType}`;
              break;
            case "cancelled":
              lastMessage = `${callType} (Cancelled)`;
              break;
            default:
              lastMessage = callType;
          }
        } else {
          lastMessage = msg.text || (msg.image ? "Photo" : "");
        }

        chatPartnersMap.set(partnerId, {
          userId: partnerId,
          lastMessage,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    });

    const chatPartnerIds = Array.from(chatPartnersMap.keys());
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    // Merge user data with chat metadata
    const enrichedChatPartners = chatPartners.map(partner => {
      const chatData = chatPartnersMap.get(partner._id.toString());
      return {
        ...partner.toObject(),
        lastMessage: chatData.lastMessage,
        lastMessageTime: chatData.lastMessageTime,
        unreadCount: chatData.unreadCount,
      };
    });

    // Sort by last message time
    enrichedChatPartners.sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.status(200).json(enrichedChatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete message
export const deleteMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { deleteForEveryone } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    if (deleteForEveryone) {
      message.deletedForEveryone = true;
      await message.save();

      // Notify receiver via socket
      const receiverSocketId = getReceiverSocketId(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", { messageId, deleteForEveryone: true });
      }
    } else {
      // Delete for me only
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
        await message.save();
      }
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit message
export const editMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is sender
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only edit your own messages" });
    }

    message.text = text;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    // Notify receiver via socket
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageEdited", message);
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in editMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Add reaction
export const addReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );

    // Add new reaction
    message.reactions.push({ userId, emoji });
    await message.save();

    // Notify both users via socket
    const receiverSocketId = getReceiverSocketId(
      message.senderId.toString() === userId.toString() 
        ? message.receiverId 
        : message.senderId
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reactionAdded", { messageId, userId, emoji });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in addReaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove reaction
export const removeReaction = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.reactions = message.reactions.filter(
      (r) => r.userId.toString() !== userId.toString()
    );
    await message.save();

    // Notify via socket
    const receiverSocketId = getReceiverSocketId(
      message.senderId.toString() === userId.toString() 
        ? message.receiverId 
        : message.senderId
    );
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("reactionRemoved", { messageId, userId });
    }

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in removeReaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      {
        senderId,
        receiverId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markAsRead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Pin/Unpin message
export const togglePinMessage = async (req, res) => {
  try {
    const { id: messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if user is part of the conversation
    if (
      message.senderId.toString() !== userId.toString() &&
      message.receiverId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    message.isPinned = !message.isPinned;
    message.pinnedAt = message.isPinned ? new Date() : null;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in togglePinMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Save call history
export const saveCallHistory = async (req, res) => {
  try {
    const { receiverId, callType, duration, status } = req.body;
    const senderId = req.user._id;

    const callMessage = new Message({
      senderId,
      receiverId,
      isCallMessage: true,
      callData: {
        callType,
        duration: duration || 0,
        status,
      },
    });

    await callMessage.save();

    // Notify receiver via socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", callMessage);
    }

    res.status(201).json(callMessage);
  } catch (error) {
    console.log("Error in saveCallHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
