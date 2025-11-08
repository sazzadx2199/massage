# Testing Call Features - Step by Step

## Prerequisites
✅ Backend running on port 3000
✅ Frontend running on port 5173
✅ Two users logged in (use two different browsers or incognito mode)

## Test 1: Ringtone Test 🔔

### Steps:
1. **User A**: Open chat with User B
2. **User A**: Click the phone or video icon to start a call
3. **User B**: Should see incoming call modal
4. **Expected**: Ringtone should play automatically and loop

### Troubleshooting:
- If ringtone doesn't play, check browser console for errors
- Browser may block autoplay - click anywhere on the page first
- Check browser sound settings
- Look for console message: "✅ Ringtone playing" or "❌ Ringtone play failed"

## Test 2: Call History - Rejected Call ❌

### Steps:
1. **User A**: Start a call to User B
2. **User B**: Click the RED reject button
3. **Both Users**: Check chat - should see "Declined voice/video call"

### Expected in Backend Console:
```
📞 Call rejected: video from [userId] to [userId]
📞 Saving call history: video call - rejected - 0s
✅ Call history saved: [messageId]
📤 Sent call history to sender
📤 Sent call history to receiver
```

## Test 3: Call History - Completed Call ✅

### Steps:
1. **User A**: Start a call to User B
2. **User B**: Click the GREEN accept button
3. **Wait 10-20 seconds** in the call
4. **User A or B**: Click "Leave Call" button
5. **Both Users**: Check chat - should see "Video/Voice call (10s)" or similar

### Expected in Backend Console:
```
📞 Call ended: roomId=[roomId]
📞 Call duration: 15s, status: completed
📞 Saving call history: video call - completed - 15s
✅ Call history saved: [messageId]
```

## Test 4: Call History - Missed Call 📵

### Steps:
1. **User B**: Go offline (close browser or disconnect)
2. **User A**: Try to call User B
3. **User A**: Should see call screen but no answer
4. **User A**: End the call
5. **User B**: Come back online and check chat - should see "Missed call"

### Expected in Backend Console:
```
📞 Saving call history: video call - missed - 0s
```

## Test 5: Call History - Cancelled Call 🚫

### Steps:
1. **User A**: Start a call to User B
2. **User A**: Immediately click "Leave Call" before User B answers
3. **Both Users**: Check chat - should see "Video/Voice call (Cancelled)"

### Expected in Backend Console:
```
📞 Call ended: roomId=[roomId]
📞 Call duration: 0s, status: cancelled
```

## Visual Indicators in Chat

### Call Message Icons:
- 🔴 Red Phone/Video: Missed or Rejected
- 🟢 Green Phone: Completed (outgoing)
- 🟢 Green Phone with arrow: Completed (incoming)
- 🟡 Yellow Phone: Cancelled

### Call Message Text Examples:
- "Video call (2m 30s)" - Completed call with duration
- "Missed video call" - You missed an incoming call
- "Video call (No answer)" - You called but they didn't answer
- "Declined voice call" - They rejected your call
- "Voice call (Declined)" - You rejected their call
- "Video call (Cancelled)" - Call was cancelled

## Debugging

### Check Browser Console (F12):
```javascript
// Should see these logs:
✅ Ringtone playing
📞 Call events
newMessage events with call data
```

### Check Backend Console:
```
📞 Saving call history: ...
✅ Call history saved: ...
📤 Sent call history to ...
```

### Common Issues:

1. **Ringtone not playing**
   - Browser autoplay policy - interact with page first
   - Check browser sound settings
   - Check file exists: `/frontend/public/sounds/ringtone.mp3`

2. **Call history not showing**
   - Check backend console for errors
   - Verify socket connection
   - Check MongoDB connection
   - Refresh the chat

3. **Call history shows but wrong status**
   - Check backend logs for actual status saved
   - Verify socket events are firing correctly

## Success Criteria ✅

- [ ] Ringtone plays when receiving call
- [ ] Ringtone stops when accepting/rejecting
- [ ] Rejected calls show in chat
- [ ] Completed calls show with duration
- [ ] Missed calls show when user offline
- [ ] Cancelled calls show when caller ends early
- [ ] Call history visible in chat timeline
- [ ] Call history shows in chat list preview
- [ ] Icons and colors display correctly
