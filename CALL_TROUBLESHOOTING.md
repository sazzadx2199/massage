# 🔧 Call Connection Troubleshooting Guide

## Problem: Call না connect হওয়া

### 🔍 Debug Steps:

## 1. Browser Console Check করুন

### Caller Console এ দেখা উচিত:
```
✅ Setting up call listeners for: [Your Name]
🎥 Starting video call with: [Contact Name]
✅ Setting up WebRTC socket listeners for room: [roomId]
🎬 Initializing call: {isInitiator: true, callType: "video", roomId: "..."}
📞 Starting call as initiator
🎬 Starting call as initiator, video: true
🎤 Requesting media access: {audio: true, video: true}
✅ Media access granted: ['audio', 'video']
✅ Local media initialized
✅ Peer connection created
➕ Adding track: audio
➕ Adding track: video
📝 Creating offer...
✅ Local description set
📤 Sending offer to room: [roomId]
📤 Sending ICE candidate
✅ ICE gathering complete
```

### Receiver Console এ দেখা উচিত:
```
📞 Incoming call received: {caller: {...}, callType: "video", roomId: "..."}
✅ Accepting call from: [Caller Name]
✅ Setting up WebRTC socket listeners for room: [roomId]
📞 Received call offer
📞 Handling incoming offer: {...}
📹 Offer has video: true
🎤 Initializing local media...
✅ Media access granted: ['audio', 'video']
✅ Local media initialized
🔗 Creating peer connection...
➕ Adding track: audio
➕ Adding track: video
📝 Setting remote description...
✅ Remote description set
🧊 Processing X queued ICE candidates
✅ Queued ICE candidate added
📝 Creating answer...
✅ Local description set
📤 Sending answer to room: [roomId]
```

### Both Should See:
```
📞 Received call answer (Caller)
📞 Handling answer: {...}
📝 Setting remote description from answer...
✅ Remote description set from answer
🧊 Adding ICE candidate
✅ ICE candidate added
🧊 ICE connection state: checking
🧊 ICE connection state: connected
🔄 Connection state changed: connected
📹 Remote track received: MediaStream
```

---

## 2. Common Issues & Solutions

### Issue 1: "Connecting..." তে আটকে আছে

**Symptoms:**
- Connection state: "connecting" থেকে "connected" হচ্ছে না
- ICE candidates exchange হচ্ছে না

**Solutions:**

#### A. STUN Server Issue
```javascript
// Check if STUN servers accessible
// Console এ দেখুন: "ICE connection state: failed"
```

**Fix:** Better STUN servers add করুন:
```javascript
// frontend/src/hooks/useWebRTC.js
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};
```

#### B. Firewall/NAT Issue
- Corporate network/firewall blocking WebRTC
- Need TURN server for relay

**Fix:** Add TURN server (optional, costs money):
```javascript
{
  urls: 'turn:your-turn-server.com:3478',
  username: 'username',
  credential: 'password'
}
```

#### C. Socket Connection Issue
**Check:**
```javascript
// Console এ দেখুন
console.log('Socket connected:', socket.connected);
```

**Fix:** Hard refresh (Ctrl+Shift+R)

---

### Issue 2: Camera/Mic Permission Denied

**Symptoms:**
- "NotAllowedError: Permission denied"
- "NotFoundError: Requested device not found"

**Solutions:**

#### Browser Settings:
1. Chrome: Settings → Privacy → Site Settings → Camera/Microphone
2. Allow access for your site
3. Reload page

#### Code Fallback:
Already implemented - falls back to audio-only if video fails

---

### Issue 3: No Remote Video/Audio

**Symptoms:**
- Connection state: "connected"
- But no video/audio from remote user

**Check:**
```javascript
// Console এ দেখুন
📹 Remote track received: MediaStream
📹 Setting remote video stream: [VideoTrack]
```

**Solutions:**

#### A. Remote Stream Not Received
```javascript
// Check peer connection
pc.ontrack = (event) => {
  console.log('Track received:', event.streams[0]);
};
```

#### B. Video Element Not Playing
```javascript
// Check autoplay policy
remoteVideoRef.current.play().catch(e => console.error(e));
```

---

### Issue 4: ICE Candidates Not Exchanging

**Symptoms:**
- "⚠️ Queueing ICE candidate (remote description not set yet)"
- Many queued candidates but not processed

**Check:**
```javascript
// Console এ দেখুন
🧊 Processing X queued ICE candidates
✅ Queued ICE candidate added
```

**Solution:** Already implemented - candidates are queued and processed after SDP exchange

---

### Issue 5: Mobile Browser Issues

**Symptoms:**
- Works on desktop, fails on mobile
- "Unauthorized" errors

**Solutions:**

#### A. Token Issue
Already fixed - using Bearer token + localStorage

#### B. Mobile Browser Restrictions
- Some mobile browsers block WebRTC
- Use Chrome/Safari on mobile

---

## 3. Network Requirements

### Ports Needed:
- **WebRTC**: UDP ports 49152-65535
- **STUN**: UDP port 3478
- **Socket.io**: TCP port 3000 (backend)

### Bandwidth:
- **Audio**: ~50 Kbps
- **Video (720p)**: ~1-2 Mbps
- **Screen Share**: ~2-4 Mbps

---

## 4. Testing Checklist

### Before Testing:
- [ ] Hard refresh both browsers (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check camera/mic permissions
- [ ] Open console in both browsers
- [ ] Check internet connection

### During Call:
- [ ] Check console logs
- [ ] Monitor connection state
- [ ] Verify ICE candidates exchange
- [ ] Check remote stream received

### If Still Failing:
1. Test on same network (WiFi)
2. Test on different networks
3. Test with different browsers
4. Check firewall settings

---

## 5. Quick Fixes

### Fix 1: Hard Refresh
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Fix 2: Clear Everything
```javascript
// Browser Console
localStorage.clear();
location.reload();
```

### Fix 3: Restart Backend
```bash
cd backend
npm run dev
```

### Fix 4: Check Socket Connection
```javascript
// Browser Console
console.log('Socket:', socket.connected);
socket.connect();
```

---

## 6. Advanced Debugging

### Enable Detailed WebRTC Logs:
```
chrome://webrtc-internals/
```

### Check ICE Connection:
```javascript
pc.oniceconnectionstatechange = () => {
  console.log('ICE State:', pc.iceConnectionState);
  // new → checking → connected → completed
};
```

### Check Signaling State:
```javascript
pc.onsignalingstatechange = () => {
  console.log('Signaling State:', pc.signalingState);
  // stable → have-local-offer → stable
};
```

---

## 7. Production Deployment Issues

### HTTPS Required:
- WebRTC requires HTTPS in production
- getUserMedia() blocked on HTTP

### CORS Issues:
- Backend and frontend on different domains
- Need proper CORS configuration

### Environment Variables:
```env
# Frontend (.env)
VITE_API_URL=https://your-backend.com

# Backend (.env)
CLIENT_URL=https://your-frontend.com
NODE_ENV=production
```

---

## 8. Contact for Help

If still not working, provide:
1. **Console logs** from both users
2. **Network tab** (check WebSocket connection)
3. **Browser version** and OS
4. **Network type** (WiFi, Mobile data, Corporate)
5. **Error messages**

---

## ✅ Success Indicators

Call is working when you see:
```
🔄 Connection state changed: connected
📹 Remote track received: MediaStream
🧊 ICE connection state: connected
```

And:
- Video/audio playing
- Duration timer counting
- Controls working (mute, video toggle)

---

**Good luck! 🚀**
