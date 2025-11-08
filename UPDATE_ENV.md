# 🔧 Update Environment Variables

## Backend .env Update

### Option 1: Manual Update (Recommended)

1. Open your backend `.env` file
2. Find this line:
   ```env
   CLIENT_URL=http://localhost:5173
   ```
3. Change it to:
   ```env
   CLIENT_URL=https://massage-virid-pi.vercel.app
   ```
4. Also update:
   ```env
   NODE_ENV=production
   ```
5. Save the file
6. Restart your backend server

---

### Option 2: If .env doesn't exist

1. Copy `backend/.env.production` to `backend/.env`
2. Fill in your actual values:
   - `MONGO_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `CLOUDINARY_*` - Your Cloudinary credentials
   - `ARCJET_KEY` - Your Arcjet key
3. Save the file
4. Start your backend server

---

## Where is your backend deployed?

### If on Render:
1. Go to: https://dashboard.render.com
2. Click your backend service
3. Go to: **Environment** tab
4. Find `CLIENT_URL` variable
5. Update value to: `https://massage-virid-pi.vercel.app`
6. Click **Save Changes**
7. Service will auto-restart

### If on Sevalla:
1. Go to your Sevalla dashboard
2. Find your backend app
3. Go to Environment Variables
4. Update `CLIENT_URL` to: `https://massage-virid-pi.vercel.app`
5. Save and restart

### If running locally:
1. Update `backend/.env` file as shown above
2. Restart: `npm run dev`

---

## Vercel Environment Variable

### Add in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click: **massage-virid-pi**
3. Go to: **Settings** → **Environment Variables**
4. Add:
   ```
   Name: VITE_API_URL
   Value: [Your backend URL without /api]
   ```

**Examples:**
- Render: `https://your-app.onrender.com`
- Sevalla: `https://your-app.sevalla.com`
- Railway: `https://your-app.railway.app`
- Local: ❌ Won't work (need deployed backend)

5. Select all environments (Production, Preview, Development)
6. Click **Save**
7. Go to **Deployments** → Click **"..."** → **Redeploy**

---

## Quick Commands

### Restart Backend (Local):
```bash
cd backend
npm run dev
```

### Check if Backend is Running:
Open in browser: `https://your-backend-url.com`

Should show something (not error page)

### Test API Endpoint:
Try: `https://your-backend-url.com/api/auth/check`

---

## ✅ Verification Checklist

After updating:

- [ ] Backend `.env` has `CLIENT_URL=https://massage-virid-pi.vercel.app`
- [ ] Backend restarted
- [ ] Vercel has `VITE_API_URL` environment variable
- [ ] Vercel redeployed after adding variable
- [ ] Open https://massage-virid-pi.vercel.app
- [ ] Press F12 → Console → No errors
- [ ] Try login/signup → Should work!

---

## 🆘 Still Not Working?

### Check Console Errors:
1. Open: https://massage-virid-pi.vercel.app
2. Press `F12`
3. Go to **Console** tab
4. Try to login
5. Share the error message

### Check Network:
1. Press `F12`
2. Go to **Network** tab
3. Try to login
4. Look at the request URL
5. Should be your backend URL + `/api/auth/login`

### Common Issues:
- ❌ "VITE_API_URL not set" → Add in Vercel and redeploy
- ❌ "CORS error" → Update backend `CLIENT_URL` and restart
- ❌ "Network error" → Backend not running or wrong URL
- ❌ "404 Not Found" → Wrong backend URL in Vercel

---

## 📝 What's Your Backend URL?

Tell me where your backend is deployed:
- Render? → Share the URL
- Sevalla? → Share the URL
- Other? → Share the URL

I'll give you exact commands! 🚀
