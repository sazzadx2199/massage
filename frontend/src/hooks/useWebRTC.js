import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useWebRTC = (roomId, isInitiator) => {
  const { socket } = useAuthStore();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionState, setConnectionState] = useState('new');
  
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);

  // ICE servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  // Initialize media stream
  const initializeMedia = useCallback(async (videoEnabled = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled ? { facingMode: 'user' } : false,
      });
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoEnabled(videoEnabled);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    peerConnection.current = pc;
    return pc;
  }, [roomId, socket]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Start call (initiator)
  const startCall = useCallback(async (videoEnabled = true) => {
    try {
      const stream = await initializeMedia(videoEnabled);
      const pc = createPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socket) {
        socket.emit('call-offer', {
          roomId,
          offer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }, [roomId, socket, initializeMedia, createPeerConnection]);

  // Answer call (receiver)
  const answerCall = useCallback(async (offer, videoEnabled = true) => {
    try {
      const stream = await initializeMedia(videoEnabled);
      const pc = createPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket) {
        socket.emit('call-answer', {
          roomId,
          answer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error('Error answering call:', error);
      throw error;
    }
  }, [roomId, socket, initializeMedia, createPeerConnection]);

  // Handle incoming answer
  const handleAnswer = useCallback(async (answer) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }, []);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate) => {
    try {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }, []);

  // End call
  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState('closed');
  }, []);

  // Handle incoming offer
  const handleOffer = useCallback(async (offer) => {
    try {
      console.log("📞 Handling incoming offer");
      const stream = await initializeMedia(true);
      const pc = createPeerConnection();

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (socket) {
        socket.emit('call-answer', {
          roomId,
          answer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }, [roomId, socket, initializeMedia, createPeerConnection]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    console.log("✅ Setting up WebRTC socket listeners for room:", roomId);

    socket.on('call-offer', ({ offer }) => {
      console.log("📞 Received call offer");
      handleOffer(offer);
    });

    socket.on('call-answer', ({ answer }) => {
      console.log("📞 Received call answer");
      handleAnswer(answer);
    });

    socket.on('ice-candidate', ({ candidate }) => {
      console.log("📞 Received ICE candidate");
      handleIceCandidate(candidate);
    });

    return () => {
      console.log("🧹 Cleaning up WebRTC socket listeners");
      socket.off('call-offer');
      socket.off('call-answer');
      socket.off('ice-candidate');
    };
  }, [socket, roomId, handleOffer, handleAnswer, handleIceCandidate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    connectionState,
    toggleAudio,
    toggleVideo,
    startCall,
    answerCall,
    endCall,
  };
};

export default useWebRTC;
