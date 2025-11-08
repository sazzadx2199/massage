import { Phone, PhoneIncoming, PhoneMissed, PhoneOff, Video } from "lucide-react";

function CallMessage({ message, isOwnMessage }) {
  const { callData } = message;
  
  const getCallIcon = () => {
    if (callData.callType === "video") {
      return <Video className="w-4 h-4" />;
    }
    
    switch (callData.status) {
      case "missed":
        return <PhoneMissed className="w-4 h-4 text-red-500" />;
      case "rejected":
        return <PhoneOff className="w-4 h-4 text-red-500" />;
      case "completed":
        return isOwnMessage ? <Phone className="w-4 h-4 text-green-500" /> : <PhoneIncoming className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <PhoneOff className="w-4 h-4 text-yellow-500" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  const getCallText = () => {
    const callType = callData.callType === "video" ? "Video call" : "Voice call";
    
    switch (callData.status) {
      case "missed":
        return isOwnMessage ? `${callType} (No answer)` : `Missed ${callType.toLowerCase()}`;
      case "rejected":
        return isOwnMessage ? `${callType} (Declined)` : `Declined ${callType.toLowerCase()}`;
      case "completed":
        return `${callType} (${formatDuration(callData.duration)})`;
      case "cancelled":
        return `${callType} (Cancelled)`;
      default:
        return callType;
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${
      isOwnMessage ? "text-cyan-100" : "text-slate-300"
    }`}>
      {getCallIcon()}
      <span>{getCallText()}</span>
    </div>
  );
}

export default CallMessage;
