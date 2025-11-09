import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

// Store active calls with start time
const activeCalls = {}; // {roomId: {callerId, receiverId, callType, startTime}}

// Helper function to save call history
async function saveCallHistory(senderId, receiverId, callType, duration, status) {
  try {
    console.log(`📞 Saving call history: ${callType} call - ${status} - ${duration}s`);
    
    const callMessage = new Message({
      senderId,
      receiverId,
      isCallMessage: true,
      callData: {
        callType,
        duration,
        status,
      },
    });

    await callMessage.save();
    console.log("✅ Call history saved:", callMessage._id);

    // Notify both users via socket
    const senderSocketId = getReceiverSocketId(senderId);
    const receiverSocketId = getReceiverSocketId(receiverId);
    
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", callMessage);
      console.log("📤 Sent call history to sender");
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", callMessage);
      console.log("📤 Sent call history to receiver");
    }
  } catch (error) {
    console.error("❌ Error saving call history:", error);
  }
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Typing indicator
  socket.on("typing", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", userId);
    }
  });

  socket.on("stopTyping", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStoppedTyping", userId);
    }
  });

  // Video/Audio Call Events
  socket.on("callUser", ({ receiverId, callType, roomId, caller }) => {
    console.log(`📞 Call initiated: ${caller.fullName} → ${receiverId} (${callType})`);
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(`🔍 Receiver socket ID:`, receiverSocketId);
    
    if (receiverSocketId) {
      // Store call info
      activeCalls[roomId] = {
        callerId: caller._id,
        receiverId,
        callType,
        startTime: null, // Will be set when accepted
      };

      console.log(`📤 Sending incomingCall to receiver`);
      io.to(receiverSocketId).emit("incomingCall", {
        caller,
        callType,
        roomId,
      });
    } else {
      console.log(`⚠️ Receiver offline, saving as missed call`);
      // Receiver is offline - save as missed call
      saveCallHistory(caller._id, receiverId, callType, 0, "missed");
    }
  });

  socket.on("callAccepted", ({ callerId, roomId }) => {
    const callerSocketId = getReceiverSocketId(callerId);
    if (callerSocketId) {
      // Mark call start time
      if (activeCalls[roomId]) {
        activeCalls[roomId].startTime = Date.now();
      }
      io.to(callerSocketId).emit("callAccepted", { roomId });
    }
  });

  socket.on("callRejected", ({ callerId, receiverId, callType, roomId }) => {
    console.log(`📞 Call rejected: ${callType} from ${callerId} to ${receiverId}`);
    
    const callerSocketId = getReceiverSocketId(callerId);
    if (callerSocketId) {
      io.to(callerSocketId).emit("callRejected");
    }
    
    // Save as rejected call
    saveCallHistory(callerId, receiverId, callType, 0, "rejected");
    
    // Clean up
    delete activeCalls[roomId];
  });

  socket.on("endCall", ({ receiverId, roomId }) => {
    console.log(`📞 Call ended: roomId=${roomId}`);
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("callEnded");
    }

    // Calculate duration and save call history
    if (activeCalls[roomId]) {
      const { callerId, receiverId: callReceiverId, callType, startTime } = activeCalls[roomId];
      const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const status = startTime ? "completed" : "cancelled";
      
      console.log(`📞 Call duration: ${duration}s, status: ${status}`);
      saveCallHistory(callerId, callReceiverId, callType, duration, status);
      
      // Clean up
      delete activeCalls[roomId];
    } else {
      console.log(`⚠️ No active call found for roomId: ${roomId}`);
    }
  });

  // WebRTC Signaling Events
  socket.on("call-offer", ({ roomId, offer }) => {
    console.log(`📞 Call offer received for room: ${roomId}`);
    // Broadcast offer to room
    socket.to(roomId).emit("call-offer", { offer });
  });

  socket.on("call-answer", ({ roomId, answer }) => {
    console.log(`📞 Call answer received for room: ${roomId}`);
    // Broadcast answer to room
    socket.to(roomId).emit("call-answer", { answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    console.log(`📞 ICE candidate received for room: ${roomId}`);
    // Broadcast ICE candidate to room
    socket.to(roomId).emit("ice-candidate", { candidate });
  });

  // Join call room
  socket.on("join-call-room", ({ roomId }) => {
    socket.join(roomId);
    console.log(`📞 User joined call room: ${roomId}`);
  });

  // Screen sharing events
  socket.on("screen-share-started", ({ roomId }) => {
    console.log(`🖥️ Screen share started in room: ${roomId}`);
    socket.to(roomId).emit("screen-share-started");
  });

  socket.on("screen-share-stopped", ({ roomId }) => {
    console.log(`📹 Screen share stopped in room: ${roomId}`);
    socket.to(roomId).emit("screen-share-stopped");
  });

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
