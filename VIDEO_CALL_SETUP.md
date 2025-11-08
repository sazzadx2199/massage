# 🎥 Video Call Setup Guide

## ✅ What's Been Added

- ✅ Video call button in chat header
- ✅ Audio call button in chat header
- ✅ ZegoCloud integration
- ✅ 1-on-1 video/audio calls
- ✅ Screen sharing support
- ✅ Beautiful call UI

---

## 🔧 Setup ZegoCloud

### Step 1: Create ZegoCloud Account

1. Go to: https://console.zegocloud.com
2. Sign up for free account
3. Create a new project

### Step 2: Get Credentials

1. In ZegoCloud Console, go to your project
2. Copy **AppID** (number)
3. Copy **ServerSecret** (string)

### Step 3: Add to Environment Variables

#### For Local Development:

Add to `frontend/.env`:
```env
VITE_ZEGO_APP_ID=your_app_id_here
VITE_ZEGO_SERVER_SECRET=your_server_secret_here
```

#### For Vercel Production:

1. Go to: https://vercel.com/dashboard
2. Click: **massage-virid-pi** (frontend project)
3. Go to: **Settings** → **Environment Variables**
4. Add these two variables:
   ```
   Name: VITE_ZEGO_APP_ID
   Value: [your AppID]

   Name: VITE_ZEGO_SERVER_SECRET
   Value: [your ServerSecret]
   ```
5. Select all environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** from Deployments tab

---

## 🎮 How to Use

### Start a Video Call:

1. Open a chat with any user
2. Click the **Video** icon (📹) in chat header
3. Video call window opens
4. Other user will see call notification (future feature)
5. Both users join the same room
6. Enjoy video calling!

### Start an Audio Call:

1. Click the **Phone** icon (📞) in chat header
2. Same as video call but audio-only mode

### Features:

- ✅ Video on/off
- ✅ Audio mute/unmute
- ✅ Screen sharing
- ✅ Camera switch (front/back on mobile)
- ✅ Beautiful UI
- ✅ Works on desktop and mobile

---

## 🚀 Testing

### Local Testing:

1. Add ZegoCloud credentials to `frontend/.env`
2. Run: `npm run dev` in frontend folder
3. Open two browser windows
4. Login with different accounts
5. Start a call from one window
6. Join from other window (same room ID)

### Production Testing:

1. Add credentials to Vercel
2. Redeploy
3. Open app in two devices/browsers
4. Test video call

---

## 🔮 Future Enhancements

### Phase 1 (Easy):
- [ ] Call notification to receiver
- [ ] Incoming call UI
- [ ] Call history
- [ ] Missed call indicator

### Phase 2 (Medium):
- [ ] Group video calls
- [ ] Call recording
- [ ] Virtual backgrounds
- [ ] Beauty filters

### Phase 3 (Advanced):
- [ ] Live streaming
- [ ] Webinar mode
- [ ] Breakout rooms

---

## 📝 Current Implementation

### Files Created:
- `frontend/src/components/VideoCallModal.jsx` - Video call UI
- `VIDEO_CALL_SETUP.md` - This guide

### Files Modified:
- `frontend/src/components/ChatHeader.jsx` - Added call buttons
- `frontend/.env.example` - Added ZegoCloud variables
- `frontend/package.json` - Added ZegoCloud package

---

## 🆘 Troubleshooting

### Video call not starting:
- ❌ Check if credentials are correct
- ❌ Check if environment variables are set
- ❌ Check browser console for errors
- ❌ Make sure you redeployed after adding variables

### Black screen in call:
- ❌ Check camera permissions
- ❌ Try different browser
- ❌ Check if camera is being used by another app

### No audio:
- ❌ Check microphone permissions
- ❌ Check if muted
- ❌ Try different browser

---

## 💰 ZegoCloud Pricing

**Free Tier:**
- ✅ 10,000 minutes/month free
- ✅ Perfect for testing and small apps
- ✅ No credit card required

**Paid Plans:**
- Start from $0.99 per 1000 minutes
- Scale as you grow

---

## ✅ Next Steps

1. Get ZegoCloud credentials
2. Add to environment variables
3. Test locally
4. Deploy to Vercel
5. Test in production
6. Enjoy video calling! 🎉

---

## 🎯 What's Next?

Want to add more features?
1. **AI Chat Bot** - Chat with GPT
2. **Voice Messages** - Record and send audio
3. **Status/Stories** - WhatsApp-style status
4. **Group Chats** - Multi-user conversations

Let me know what you want next! 🚀
