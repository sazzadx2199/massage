import { useState, useEffect, useRef } from 'react';
import { Phone, Mic, MicOff, Video as VideoIcon, VideoOff, Volume2, VolumeX, Minimize2, Maximize2, X } from 'lucide-react';
import useWebRTC from '../../hooks/useWebRTC';

function WhatsAppCallScreen({ 
  contact, 
  callType, 
  isInitiator,
  roomId,
  onEnd, 
  onMinimize,
  offer 
}) {
  const [duration, setDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const {
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    connectionState,
    toggleAudio,
    toggleVideo,
    startCall,
    endCall,
  } = useWebRTC(roomId, isInitiator);

  // Initialize call
  useEffect(() => {
    console.log("🎬 Initializing call:", { isInitiator, callType, roomId });
    
    if (isInitiator) {
      console.log("📞 Starting call as initiator");
      startCall(callType === 'video');
    } else {
      console.log("📞 Waiting for offer as receiver");
      // Receiver will automatically handle offer via socket events in useWebRTC
    }
  }, [isInitiator, callType, roomId, startCall]);

  // Setup video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Setup remote audio for audio calls
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      console.log('🔊 Setting up remote audio stream');
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current.volume = isSpeakerOn ? 1.0 : 0.5;
      remoteAudioRef.current.play().catch(e => console.error('Audio play error:', e));
    }
  }, [remoteStream, isSpeakerOn]);

  // Call duration timer
  useEffect(() => {
    if (connectionState === 'connected') {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [connectionState]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    onEnd();
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    onMinimize?.();
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-[#075E54] rounded-lg shadow-2xl p-3 min-w-[200px]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></div>
            <div>
              <p className="text-white text-sm font-medium">{contact.fullName}</p>
              <p className="text-white/80 text-xs">{formatDuration(duration)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="text-white hover:bg-white/10 p-1 rounded"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleEndCall}
              className="text-white hover:bg-red-500 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0B141A] z-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gradient-to-b from-[#075E54] to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-medium">{contact.fullName}</h2>
            <p className="text-white/80 text-sm">
              {connectionState === 'connected' ? formatDuration(duration) : 'Connecting...'}
            </p>
          </div>
          <button
            onClick={handleMinimize}
            className="text-white hover:bg-white/10 p-2 rounded-full transition-all"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video/Avatar Display */}
      <div className="flex-1 relative flex items-center justify-center">
        {callType === 'video' && remoteStream ? (
          <>
            {/* Remote Video (Full Screen) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            {localStream && (
              <div className="absolute top-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              </div>
            )}
          </>
        ) : (
          /* Audio Call - Show Avatar */
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping"></div>
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="relative w-48 h-48 rounded-full border-4 border-[#25D366] shadow-2xl object-cover"
              />
            </div>
            <h3 className="text-white text-2xl font-medium mb-2">{contact.fullName}</h3>
            <p className="text-white/60 text-lg">
              {connectionState === 'connected' ? formatDuration(duration) : 'Ringing...'}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex justify-center items-center gap-6">
          {/* Mute Button */}
          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isAudioEnabled
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Video Toggle (Video calls only) */}
          {callType === 'video' && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isVideoEnabled
                  ? 'bg-white/20 hover:bg-white/30 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
          )}

          {/* Speaker Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isSpeakerOn
                ? 'bg-white/20 hover:bg-white/30 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/60'
            }`}
            title={isSpeakerOn ? 'Speaker on' : 'Speaker off'}
          >
            {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-lg"
            title="End call"
          >
            <Phone className="w-7 h-7 text-white rotate-135" />
          </button>
        </div>

        {/* End-to-end encrypted label */}
        <div className="mt-4 text-center">
          <p className="text-white/40 text-xs flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-[#25D366] rounded-full"></span>
            End-to-end encrypted
          </p>
        </div>
      </div>

      {/* Connection Status Indicator */}
      {connectionState !== 'connected' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full">
          <p className="text-white text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            {connectionState === 'connecting' ? 'Connecting...' : 'Waiting...'}
          </p>
        </div>
      )}

      {/* Hidden audio element for audio calls */}
      {callType === 'audio' && (
        <audio
          ref={remoteAudioRef}
          autoPlay
          playsInline
          className="hidden"
        />
      )}
    </div>
  );
}

export default WhatsAppCallScreen;
