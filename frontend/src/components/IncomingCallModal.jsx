import { Phone, PhoneOff, Video } from "lucide-react";
import { useEffect } from "react";

function IncomingCallModal({ caller, callType, onAccept, onReject }) {
  useEffect(() => {
    // Play ringtone
    const ringtone = new Audio("/sounds/ringtone.mp3");
    ringtone.loop = true;
    ringtone.volume = 0.7;
    
    const playRingtone = async () => {
      try {
        await ringtone.play();
        console.log("✅ Ringtone playing");
      } catch (error) {
        console.error("❌ Ringtone play failed:", error);
        document.addEventListener('click', () => {
          ringtone.play().catch(e => console.error("Still failed:", e));
        }, { once: true });
      }
    };
    
    playRingtone();

    return () => {
      ringtone.pause();
      ringtone.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#075E54] to-[#128C7E] z-50 flex flex-col items-center justify-center p-4">
      {/* WhatsApp Logo/Icon */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="text-white text-2xl font-light">WhatsApp</div>
      </div>

      {/* Caller Info */}
      <div className="flex flex-col items-center mb-12">
        {/* Caller Avatar with Pulse Animation */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
          <img
            src={caller.profilePic || "/avatar.png"}
            alt={caller.fullName}
            className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
          />
        </div>

        {/* Caller Name */}
        <h2 className="text-3xl font-medium text-white mb-2">
          {caller.fullName}
        </h2>

        {/* Call Type */}
        <p className="text-white/80 text-lg flex items-center gap-2">
          {callType === "video" ? (
            <>
              <Video className="w-5 h-5" />
              WhatsApp video call
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              WhatsApp voice call
            </>
          )}
        </p>

        {/* Ringing Text */}
        <p className="text-white/60 text-sm mt-4 animate-pulse">
          Ringing...
        </p>
      </div>

      {/* Action Buttons - WhatsApp Style */}
      <div className="flex gap-20 items-center">
        {/* Reject Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
          <span className="text-white text-sm font-medium">Decline</span>
        </div>

        {/* Accept Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] flex items-center justify-center transition-all transform hover:scale-110 shadow-lg animate-pulse"
          >
            {callType === "video" ? (
              <Video className="w-7 h-7 text-white" />
            ) : (
              <Phone className="w-7 h-7 text-white" />
            )}
          </button>
          <span className="text-white text-sm font-medium">Accept</span>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 text-center">
        <p className="text-white/40 text-xs">
          End-to-end encrypted
        </p>
      </div>
    </div>
  );
}

export default IncomingCallModal;
