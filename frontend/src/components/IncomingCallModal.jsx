import { Phone, PhoneOff, Video } from "lucide-react";
import { useEffect, useState } from "react";

function IncomingCallModal({ caller, callType, onAccept, onReject }) {
  const [ringing, setRinging] = useState(true);

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
        // Try to play on user interaction
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
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* Caller Avatar */}
        <div className="mb-6">
          <div className="relative inline-block">
            <img
              src={caller.profilePic || "/avatar.png"}
              alt={caller.fullName}
              className="w-32 h-32 rounded-full mx-auto border-4 border-cyan-500"
            />
            {ringing && (
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500 animate-ping" />
            )}
          </div>
        </div>

        {/* Caller Name */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {caller.fullName}
        </h2>

        {/* Call Type */}
        <p className="text-slate-400 mb-8 flex items-center justify-center gap-2">
          {callType === "video" ? (
            <>
              <Video className="w-5 h-5" />
              Incoming Video Call
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Incoming Audio Call
            </>
          )}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          {/* Reject Button */}
          <button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all transform hover:scale-110"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </button>

          {/* Accept Button */}
          <button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all transform hover:scale-110 animate-pulse"
          >
            {callType === "video" ? (
              <Video className="w-8 h-8 text-white" />
            ) : (
              <Phone className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCallModal;
