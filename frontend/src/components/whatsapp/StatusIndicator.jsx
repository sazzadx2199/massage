import { Check, CheckCheck, Clock } from "lucide-react";

function StatusIndicator({ status, isRead }) {
  if (status === "pending") {
    return <Clock className="w-4 h-4 text-gray-400" />;
  }
  
  if (status === "sent") {
    return <Check className="w-4 h-4 text-gray-400" />;
  }
  
  if (status === "delivered") {
    return <CheckCheck className="w-4 h-4 text-gray-400" />;
  }
  
  if (isRead) {
    return <CheckCheck className="w-4 h-4 text-[#53BDEB]" />;
  }
  
  return <CheckCheck className="w-4 h-4 text-gray-400" />;
}

export default StatusIndicator;
