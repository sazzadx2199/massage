import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useWebRTC = (roomId, isInitiator) => {
  const { socket } = useAuthStore();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const iceCandidatesQueue = useRef([]);
  const originalVideoTrack = useRef(null);
  const connectionTimeout = useRef(null);

  // ICE servers configuration - Multiple STUN servers + Multiple TURN servers
  const iceServers = {
    iceServers: [
      // STUN servers for same network
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      { urls: 'stun:stun.services.mozilla.com' },
      
      // Free TURN servers for different networks (try multiple)
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      
      // TODO: For production, replace with paid TURN server:
      // Twilio: https://www.twilio.com/stun-turn ($0.0004/min)
      // Xirsys: https://xirsys.com (50GB free/month)
      // Metered: https://www.metered.ca/tools/openrelay/ (50GB free/month)
      //
      // Example:
      // {
      //   urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
      //   username: 'your-twilio-username',
      //   credential: 'your-twilio-credential',
      // },
    ],
    iceCandidatePoolSize: 10,
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
      
      // Clear timeout if connected
      if (pc.connectionState === 'connected') {
        if (connectionTimeout.current) {
          clearTimeout(connectionTimeout.current);
          connectionTimeout.current = null;
        }
      }
      
      // Handle failed connection
      if (pc.connectionState === 'failed') {
        console.error('❌ Peer connection failed');
        if (connectionTimeout.current) {
          clearTimeout(connectionTimeout.current);
        }
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('🧊 ICE connection state:', pc.iceConnectionState);
      
      // Handle connection failures
      if (pc.iceConnectionState === 'failed') {
        console.error('❌ ICE connection failed - trying to restart');
        // Try to restart ICE
        pc.restartIce();
      } else if (pc.iceConnectionState === 'disconnected') {
        console.warn('⚠️ ICE connection disconnected');
      } else if (pc.iceConnectionState === 'connected') {
        console.log('✅ ICE connection established successfully!');
      }
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

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Starting screen share...');
      
      // Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: false,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      
      // Save original video track
      if (localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
          originalVideoTrack.current = videoTrack;
        }
      }

      // Replace video track in peer connection
      if (peerConnection.current) {
        const sender = peerConnection.current
          .getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender) {
          console.log('🔄 Replacing video track with screen track...');
          await sender.replaceTrack(screenTrack);
          console.log('✅ Screen track replaced in peer connection');
          
          // Notify remote peer about screen sharing
          if (socket) {
            socket.emit('screen-share-started', { roomId });
            console.log('📡 Notified remote peer about screen share');
          }
        } else {
          console.error('❌ No video sender found in peer connection');
        }
      } else {
        console.error('❌ No peer connection available');
      }

      // Replace in local stream
      if (localStreamRef.current) {
        const oldTrack = localStreamRef.current.getVideoTracks()[0];
        if (oldTrack) {
          localStreamRef.current.removeTrack(oldTrack);
        }
        localStreamRef.current.addTrack(screenTrack);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }

      setIsScreenSharing(true);

      // Handle screen share stop
      screenTrack.onended = () => {
        console.log('🖥️ Screen share ended');
        stopScreenShare();
      };

    } catch (error) {
      console.error('❌ Error starting screen share:', error);
    }
  }, []);

  // Stop screen sharing
  const stopScreenShare = useCallback(async () => {
    try {
      console.log('🖥️ Stopping screen share...');

      if (!originalVideoTrack.current) {
        console.warn('⚠️ No original video track to restore');
        return;
      }

      // Replace screen track with camera track
      if (peerConnection.current) {
        const sender = peerConnection.current
          .getSenders()
          .find(s => s.track?.kind === 'video');
        
        if (sender) {
          console.log('🔄 Restoring camera track...');
          await sender.replaceTrack(originalVideoTrack.current);
          console.log('✅ Camera track restored in peer connection');
          
          // Notify remote peer that screen sharing stopped
          if (socket) {
            socket.emit('screen-share-stopped', { roomId });
            console.log('📡 Notified remote peer that screen share stopped');
          }
        } else {
          console.error('❌ No video sender found');
        }
      } else {
        console.error('❌ No peer connection available');
      }

      // Replace in local stream
      if (localStreamRef.current) {
        const screenTrack = localStreamRef.current.getVideoTracks()[0];
        if (screenTrack) {
          screenTrack.stop();
          localStreamRef.current.removeTrack(screenTrack);
        }
        localStreamRef.current.addTrack(originalVideoTrack.current);
        setLocalStream(new MediaStream(localStreamRef.current.getTracks()));
      }

      setIsScreenSharing(false);
      originalVideoTrack.current = null;

    } catch (error) {
      console.error('❌ Error stopping screen share:', error);
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
        
        // Set connection timeout (30 seconds)
        connectionTimeout.current = setTimeout(() => {
          if (peerConnection.current?.connectionState !== 'connected') {
            console.error('⏱️ Connection timeout - call did not connect within 30 seconds');
            console.log('💡 Tip: Check your network connection or firewall settings');
          }
        }, 30000);
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
      
      // Detect if offer has video track
      const hasVideo = offer.sdp.includes('m=video');
      console.log('📹 Offer has video:', hasVideo);
      
      console.log('🎤 Initializing local media...');
      const stream = await initializeMedia(hasVideo);
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

    socket.on('screen-share-started', () => {
      console.log("🖥️ Remote peer started screen sharing");
      // Remote stream will automatically update via ontrack
    });

    socket.on('screen-share-stopped', () => {
      console.log("📹 Remote peer stopped screen sharing");
      // Remote stream will automatically update via ontrack
    });

    return () => {
      console.log("🧹 Cleaning up WebRTC socket listeners");
      socket.off('call-offer');
      socket.off('call-answer');
      socket.off('ice-candidate');
      socket.off('screen-share-started');
      socket.off('screen-share-stopped');
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
    isScreenSharing,
    connectionState,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    startCall,
    answerCall,
    endCall,
  };
};

export default useWebRTC;
