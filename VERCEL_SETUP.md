# Vercel Deployment Setup ✅

## Frontend Deployed on Vercel - Next Steps

### 1️⃣ Get Your Vercel URL
After deployment, you'll get a URL like:
```
https://your-app-name.vercel.app
```

### 2️⃣ Update Backend Environment Variables

In your backend `.env` file, update:

```env
# Change this from localhost to your Vercel URL
CLIENT_URL=https://your-app-name.vercel.app

# Also update NODE_ENV for production
NODE_ENV=production
```

### 3️⃣ Update Frontend API URL

In `frontend/src/lib/axios.js`, the baseURL should point to your backend:

```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:3000/api" 
    : "https://your-backend-url.com/api",  // Your Sevalla/Render backend URL
  withCredentials: true,
});
```

### 4️⃣ Add Environment Variable in Vercel (if needed)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
```
VITE_API_URL=https://your-backend-url.com/api
```

Then update `axios.js`:
```javascript
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
```

### 5️⃣ Restart Backend Server

After updating `.env`, restart your backend:
```bash
cd backend
npm run dev  # or restart on Sevalla/Render
```

### 6️⃣ Test Your Deployment

1. Open your Vercel URL: `https://your-app-name.vercel.app`
2. Try to sign up / login
3. Check browser console for any CORS errors
4. Test real-time messaging

---

## Common Issues & Solutions

### ❌ CORS Error
**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:** Make sure `CLIENT_URL` in backend `.env` matches your Vercel URL exactly (no trailing slash)

### ❌ Cookie Not Working
**Problem:** Authentication not persisting

**Solution:** Check `sameSite` and `secure` cookie settings in backend:
```javascript
// backend/src/controllers/auth.controller.js
res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### ❌ Socket.io Not Connecting
**Problem:** Real-time features not working

**Solution:** Update socket connection in frontend:
```javascript
// frontend/src/store/useAuthStore.js
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket", "polling"]
});
```

---

## Deployment Checklist ✅

- [ ] Frontend deployed on Vercel
- [ ] Backend `CLIENT_URL` updated with Vercel URL
- [ ] Backend restarted with new environment variables
- [ ] Frontend can connect to backend API
- [ ] Authentication working (login/signup)
- [ ] Real-time messaging working
- [ ] Image upload working (Cloudinary)
- [ ] All features tested

---

## Auto-Deploy Setup

Vercel automatically deploys when you push to GitHub:

1. Push to `main` branch → Auto deploys to production
2. Push to other branches → Creates preview deployments
3. No build limits on free tier! 🎉

---

## Need Help?

Check `DEPLOYMENT.md` for more deployment options and troubleshooting.
