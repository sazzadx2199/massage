# 🚀 Quick Setup After Vercel Deployment

## Your Vercel URL
```
https://your-app-name.vercel.app
```
(Replace with your actual Vercel URL)

---

## ⚡ 3 Steps to Complete Setup

### Step 1: Add Environment Variable in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this variable:
```
Name: VITE_API_URL
Value: https://your-backend-url.com
```
(Your Sevalla/Render backend URL without `/api`)

**Then redeploy:**
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

### Step 2: Update Backend .env

In your backend `.env` file:
```env
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

**Restart backend server** after this change.

---

### Step 3: Test Everything

Open your Vercel URL and test:
- ✅ Sign up / Login
- ✅ Send messages
- ✅ Real-time updates
- ✅ Image upload
- ✅ All features

---

## 🔧 If Something Doesn't Work

### Check Browser Console
Press `F12` → Console tab → Look for errors

### Common Fixes:

**CORS Error?**
- Make sure `CLIENT_URL` in backend matches Vercel URL exactly
- Restart backend after changing `.env`

**Can't Login?**
- Check if `VITE_API_URL` is set in Vercel
- Redeploy frontend after adding env variable

**Socket.io Not Working?**
- Make sure backend URL is correct
- Check if backend is running

---

## 📝 Current Setup

✅ **Frontend:** Vercel (Deployed)
✅ **Backend:** Sevalla/Render (Running)
✅ **Database:** MongoDB Atlas
✅ **Storage:** Cloudinary
✅ **Email:** Resend (Disabled)

---

## 🎉 Done!

Your app should now be fully functional on Vercel with unlimited builds!

For detailed troubleshooting, see `VERCEL_SETUP.md`
