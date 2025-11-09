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
  const iceCandidatesQueue = useRef([]);

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
      console.log('🎤 Requesting media access:', { audio: true, video: videoEnabled });
      
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: videoEnabled ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        } : false,
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Media access granted:', stream.getTracks().map(t => t.kind));
      
      localStreamRef.current = stream;
      setLocalStream(stream);
      setIsVideoEnabled(videoEnabled && stream.getVideoTracks().length > 0);
      return stream;
    } catch (error) {
      console.error('❌ Error accessing media devices:', error);
      
      // Try audio only if video fails
      if (videoEnabled) {
        console.log('⚠️ Retrying with audio only...');
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          localStreamRef.current = audioStream;
          setLocalStream(audioStream);
          setIsVideoEnabled(false);
          return audioStream;
        } catch (audioError) {
          console.error('❌ Audio access also failed:', audioError);
          throw audioError;
        }
      }
      throw error;
    }
  }, []);

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(iceServers);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log('📤 Sending ICE candidate');
        socket.emit('ice-candidate', {
          roomId,
          candidate: event.candidate,
        });
      } else if (!event.candidate) {
        console.log('✅ ICE gathering complete');
      }
    };

    pc.ontrack = (event) => {
      console.log('📹 Remote track received:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      console.log('🔄 Connection state changed:', pc.connectionState);
      setConnectionState(pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', pc.iceConnectionState);
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
      console.log('🎬 Starting call as initiator, video:', videoEnabled);
      const stream = await initializeMedia(videoEnabled);
      console.log('✅ Local media initialized');
      
      const pc = createPeerConnection();
      console.log('✅ Peer connection created');

      stream.getTracks().forEach((track) => {
        console.log('➕ Adding track:', track.kind);
        pc.addTrack(track, stream);
      });

      console.log('📝 Creating offer...');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('✅ Local description set');

      if (socket) {
        console.log('📤 Sending offer to room:', roomId);
        socket.emit('call-offer', {
          roomId,
          offer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error('❌ Error starting call:', error);
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

  // Process queued ICE candidates
  const processQueuedCandidates = useCallback(async () => {
    if (iceCandidatesQueue.current.length > 0) {
      console.log(`🧊 Processing ${iceCandidatesQueue.current.length} queued ICE candidates`);
      for (const candidate of iceCandidatesQueue.current) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log('✅ Queued ICE candidate added');
        } catch (error) {
          console.error('❌ Error adding queued candidate:', error);
        }
      }
      iceCandidatesQueue.current = [];
    }
  }, []);

  // Handle incoming answer
  const handleAnswer = useCallback(async (answer) => {
    try {
      console.log('📞 Handling answer:', answer);
      if (peerConnection.current) {
        console.log('📝 Setting remote description from answer...');
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        console.log('✅ Remote description set from answer');
        
        // Process any queued ICE candidates
        await processQueuedCandidates();
      } else {
        console.error('❌ No peer connection available');
      }
    } catch (error) {
      console.error('❌ Error handling answer:', error);
    }
  }, [processQueuedCandidates]);

  // Handle ICE candidate
  const handleIceCandidate = useCallback(async (candidate) => {
    try {
      if (peerConnection.current && peerConnection.current.remoteDescription) {
        console.log('🧊 Adding ICE candidate');
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
        console.log('✅ ICE candidate added');
      } else {
        console.warn('⚠️ Queueing ICE candidate (remote description not set yet)');
        iceCandidatesQueue.current.push(candidate);
      }
    } catch (error) {
      console.error('❌ Error handling ICE candidate:', error);
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
      console.log("📞 Handling incoming offer:", offer);
      
      console.log('🎤 Initializing local media...');
      const stream = await initializeMedia(true);
      console.log('✅ Local media initialized');
      
      console.log('🔗 Creating peer connection...');
      const pc = createPeerConnection();

      stream.getTracks().forEach((track) => {
        console.log('➕ Adding track:', track.kind);
        pc.addTrack(track, stream);
      });

      console.log('📝 Setting remote description...');
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('✅ Remote description set');
      
      // Process any queued ICE candidates
      await processQueuedCandidates();
      
      console.log('📝 Creating answer...');
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      console.log('✅ Local description set');

      if (socket) {
        console.log('📤 Sending answer to room:', roomId);
        socket.emit('call-answer', {
          roomId,
          answer: pc.localDescription,
        });
      }
    } catch (error) {
      console.error('❌ Error handling offer:', error);
    }
  }, [roomId, socket, initializeMedia, createPeerConnection, processQueuedCandidates]);

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
