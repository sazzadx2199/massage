# 🚀 Your Deployment Setup

## Your URLs
- **Frontend (Vercel):** https://massage-virid-pi.vercel.app
- **Backend:** [Your Sevalla/Render URL - add here]

---

## ⚡ Complete These 3 Steps Now

### Step 1: Add Environment Variable in Vercel ✅

1. Go to: https://vercel.com/dashboard
2. Click on your project: **massage-virid-pi**
3. Go to: **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   ```
   Name: VITE_API_URL
   Value: [Your backend URL without /api]
   ```
   Example: `https://your-backend.onrender.com` or `https://your-backend.sevalla.com`

6. Click **Save**
7. Go to **Deployments** tab
8. Click **"..."** on the latest deployment
9. Click **"Redeploy"**

---

### Step 2: Update Backend Environment Variables ✅

In your backend server (Sevalla/Render), update `.env`:

```env
CLIENT_URL=https://massage-virid-pi.vercel.app
NODE_ENV=production
```

**Important:** Restart your backend server after this change!

---

### Step 3: Test Your App ✅

Open: https://massage-virid-pi.vercel.app

Test these features:
- [ ] Sign up with new account
- [ ] Login
- [ ] Send text message
- [ ] Send image
- [ ] Real-time message updates
- [ ] Reply to message
- [ ] Edit message
- [ ] Delete message
- [ ] Pin message
- [ ] Forward message
- [ ] Search in chat
- [ ] Settings page

---

## 🔍 Troubleshooting

### If you see CORS error:

**Check:**
1. Backend `.env` has: `CLIENT_URL=https://massage-virid-pi.vercel.app`
2. Backend server is restarted
3. No trailing slash in URL

### If login doesn't work:

**Check:**
1. `VITE_API_URL` is added in Vercel
2. Frontend is redeployed after adding env variable
3. Backend URL is correct (without `/api`)

### If real-time doesn't work:

**Check:**
1. Backend supports WebSocket
2. Socket.io is properly configured
3. Backend URL is accessible

---

## 📝 Your Current Setup

```
Frontend (Vercel)
    ↓ API Calls
Backend (Sevalla/Render)
    ↓ Database
MongoDB Atlas
    ↓ File Storage
Cloudinary
```

---

## ✅ After Setup Complete

Your app will have:
- ✅ Unlimited builds on Vercel
- ✅ Auto-deploy on git push
- ✅ Fast global CDN
- ✅ HTTPS by default
- ✅ Custom domain support (optional)

---

## 🎉 You're Almost Done!

Just complete the 3 steps above and your app will be fully functional!

**Need your backend URL?**
- Check Sevalla/Render dashboard
- Or check your backend `.env` file
- Should look like: `https://something.onrender.com` or `https://something.sevalla.com`
