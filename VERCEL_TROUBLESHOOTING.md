# 🔧 Vercel Deployment Troubleshooting

## ❌ Problem: Login/Register Not Working

### Symptoms:
- Click login/signup button - nothing happens
- Or shows error in console
- Or loading forever

### Root Cause:
**`VITE_API_URL` environment variable is missing in Vercel!**

---

## ✅ Solution: Add Environment Variable

### Step-by-Step Fix:

#### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

#### 2. Select Your Project
Click on: **massage-virid-pi**

#### 3. Go to Settings
Click: **Settings** (top menu)

#### 4. Click Environment Variables
Left sidebar: **Environment Variables**

#### 5. Add New Variable
Click: **Add New**

Fill in:
```
Name: VITE_API_URL
Value: [Your backend URL]
```

**Important:** 
- ❌ Don't add `/api` at the end
- ✅ Just the base URL

**Examples:**
```
✅ Correct: https://chatify-backend.onrender.com
✅ Correct: https://chatify-backend.sevalla.com
❌ Wrong: https://chatify-backend.onrender.com/api
❌ Wrong: https://chatify-backend.onrender.com/
```

#### 6. Select Environment
Check all three:
- ✅ Production
- ✅ Preview
- ✅ Development

#### 7. Save
Click: **Save**

#### 8. Redeploy
- Go to **Deployments** tab
- Find latest deployment
- Click **"..."** (three dots)
- Click **"Redeploy"**
- Wait for deployment to complete (1-2 minutes)

---

## 🔍 How to Check if It's Working

### Method 1: Browser Console
1. Open your Vercel site: https://massage-virid-pi.vercel.app
2. Press `F12` (open DevTools)
3. Go to **Console** tab
4. Try to login/signup
5. Look for errors:
   - ❌ If you see: "VITE_API_URL not set" → Variable missing
   - ❌ If you see: "CORS error" → Backend CORS issue
   - ❌ If you see: "Network error" → Backend URL wrong
   - ✅ If no errors → Should work!

### Method 2: Network Tab
1. Open DevTools (`F12`)
2. Go to **Network** tab
3. Try to login
4. Look at the request:
   - Check the URL - should be your backend URL
   - Check the response - should be 200 OK

---

## 🎯 What's Your Backend URL?

### If Backend is on Render:
1. Go to: https://dashboard.render.com
2. Click your backend service
3. Copy the URL at the top
4. Should look like: `https://something.onrender.com`

### If Backend is on Sevalla:
1. Go to your Sevalla dashboard
2. Find your backend app
3. Copy the domain/URL
4. Should look like: `https://something.sevalla.com`

### If Backend is Local:
❌ **This won't work!** 
- Vercel (cloud) can't connect to localhost (your computer)
- You need to deploy backend first

---

## 🚀 Quick Test

After adding `VITE_API_URL` and redeploying:

1. Open: https://massage-virid-pi.vercel.app
2. Open Console (`F12`)
3. Type: `console.log(import.meta.env.VITE_API_URL)`
4. Should show your backend URL
5. If shows `undefined` → Variable not set correctly

---

## 📋 Checklist

Before asking for help, verify:

- [ ] `VITE_API_URL` added in Vercel
- [ ] Value is correct (no `/api` at end)
- [ ] All environments selected (Production, Preview, Development)
- [ ] Redeployed after adding variable
- [ ] Backend is actually running and accessible
- [ ] Backend `.env` has `CLIENT_URL=https://massage-virid-pi.vercel.app`
- [ ] Backend server restarted after changing `.env`

---

## 💡 Still Not Working?

### Check Backend CORS:
Your backend must allow requests from Vercel:

```javascript
// backend/src/server.js
const allowedOrigins = [
  'https://massage-virid-pi.vercel.app',
  'http://localhost:5173'
];
```

### Check Backend is Running:
Open your backend URL in browser:
- Should show something (not error)
- Try: `https://your-backend-url.com/api/auth/check` or similar

### Check Cookies:
Backend must set cookies with:
```javascript
res.cookie("jwt", token, {
  httpOnly: true,
  secure: true,  // Must be true for HTTPS
  sameSite: "none",  // Must be "none" for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

---

## 🆘 Need More Help?

Share these details:
1. Your backend URL
2. Console errors (screenshot)
3. Network tab (screenshot of failed request)
4. Is backend deployed and running?
