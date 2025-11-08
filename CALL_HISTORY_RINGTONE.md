# Call History & Ringtone Features

## Features Added

### 1. Call Ringtone ✅
- **Automatic ringtone** plays when receiving incoming calls
- Ringtone file: `/frontend/public/sounds/ringtone.mp3` (already exists)
- Loops continuously until call is answered or rejected
- Stops automatically when call ends

### 2. Call History in Chat 📞
Call history is now saved and displayed in the chat interface:

#### Call Status Types:
- **Missed** - Receiver was offline or didn't answer
- **Rejected** - Receiver declined the call
- **Completed** - Call was answered and completed (shows duration)
- **Cancelled** - Caller cancelled before receiver answered

#### Display Features:
- Shows call type (Video/Audio) with icons
- Shows call duration for completed calls
- Shows call status with color coding:
  - 🔴 Red: Missed/Rejected calls
  - 🟢 Green: Completed calls
  - 🟡 Yellow: Cancelled calls
- Appears in chat timeline with timestamp
- Shows in chat list preview

## Technical Implementation

### Backend Changes:

1. **Message Model** (`backend/src/models/Message.js`)
   - Added `isCallMessage` field
   - Added `callData` object with:
     - `callType`: "audio" or "video"
     - `duration`: call duration in seconds
     - `status`: "missed", "rejected", "completed", or "cancelled"

2. **Socket Events** (`backend/src/lib/socket.js`)
   - Automatically saves call history when:
     - Call is rejected
     - Call is ended
     - Receiver is offline (missed call)
   - Tracks call duration from accept to end

3. **Message Controller** (`backend/src/controllers/message.controller.js`)
   - Added `saveCallHistory` endpoint
   - Updated `getChatPartners` to format call messages in preview

### Frontend Changes:

1. **CallMessage Component** (`frontend/src/components/CallMessage.jsx`)
   - New component to display call history messages
   - Shows appropriate icon based on call type and status
   - Formats duration (e.g., "2m 30s")

2. **ChatContainer** (`frontend/src/components/ChatContainer.jsx`)
   - Integrated CallMessage component
   - Displays call history in chat timeline

3. **IncomingCallModal** (`frontend/src/components/IncomingCallModal.jsx`)
   - Already had ringtone implementation
   - Plays `/sounds/ringtone.mp3` on loop

4. **Call Store** (`frontend/src/store/useCallStore.js`)
   - Added `startTime` tracking
   - Added `setCallStartTime` method

## Usage

### For Users:
1. **Making Calls**: Click video/audio icons in chat header
2. **Receiving Calls**: Ringtone plays automatically, accept or reject
3. **Viewing History**: Call records appear in chat timeline
4. **Call Duration**: Completed calls show duration

### For Developers:
Call history is saved automatically via socket events. No manual API calls needed.

## Database Schema

```javascript
{
  isCallMessage: Boolean,
  callData: {
    callType: String, // "audio" | "video"
    duration: Number, // seconds
    status: String    // "missed" | "rejected" | "completed" | "cancelled"
  }
}
```

## Notes

- Call history is saved for both participants
- Ringtone requires user interaction first (browser autoplay policy)
- Call duration is calculated from accept to end time
- Offline users receive "missed call" notifications
