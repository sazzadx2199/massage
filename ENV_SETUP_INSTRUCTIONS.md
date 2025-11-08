# 📝 Environment Variables Setup

## ✅ Files Created

I've created `.env` files for you:
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables

---

## 🔧 Backend Setup (`backend/.env`)

### Required Changes:

Open `backend/.env` and update these values:

#### 1. MongoDB URI
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/chatify?retryWrites=true&w=majority
```
**Where to get:**
- Go to: https://cloud.mongodb.com
- Click: Database → Connect → Connect your application
- Copy the connection string
- Replace `<password>` with your actual password

#### 2. JWT Secret
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```
**Generate a strong secret:**
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Cloudinary Credentials
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
**Where to get:**
- Go to: https://cloudinary.com/console
- Copy: Cloud Name, API Key, API Secret

#### 4. Arcjet Key
```env
ARCJET_KEY=ajkey_your_arcjet_key
```
**Where to get:**
- Go to: https://app.arcjet.com
- Create a new site
- Copy the API key

#### 5. Client URL (Already Set!)
```env
CLIENT_URL=https://massage-virid-pi.vercel.app
```
✅ This is already correct for your Vercel deployment!

---

## 🔧 Frontend Setup (`frontend/.env`)

### Required Changes:

Open `frontend/.env` and update:

```env
VITE_API_URL=https://your-backend-url.com
```

**What to put here:**
- If backend on **Render**: `https://your-app.onrender.com`
- If backend on **Sevalla**: `https://your-app.sevalla.com`
- If backend on **Railway**: `https://your-app.railway.app`
- If backend **local**: ❌ Won't work with Vercel (need deployed backend)

**Important:** 
- ❌ Don't add `/api` at the end
- ❌ Don't add trailing slash `/`

---

## 🚀 After Updating

### For Backend:

If running locally:
```bash
cd backend
npm run dev
```

If deployed on Render/Sevalla:
- Update environment variables in their dashboard
- Restart the service

### For Frontend:

**Important:** The `frontend/.env` file is for local development only!

For Vercel deployment, you must add the variable in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Click: **massage-virid-pi**
3. Go to: **Settings** → **Environment Variables**
4. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.com
   ```
5. Select all environments
6. Click **Save**
7. **Redeploy** from Deployments tab

---

## ✅ Verification

### Test Backend:
```bash
cd backend
npm run dev
```
Should show: "Server running on port: 3000"

### Test Frontend Locally:
```bash
cd frontend
npm run dev
```
Open: http://localhost:5173

### Test Production:
Open: https://massage-virid-pi.vercel.app

---

## 🔒 Security Notes

- ✅ `.env` files are in `.gitignore` (won't be committed to GitHub)
- ✅ Never share your `.env` files publicly
- ✅ Use different secrets for development and production
- ✅ Keep your MongoDB password secure

---

## 📋 Quick Checklist

- [ ] Updated `MONGO_URI` in `backend/.env`
- [ ] Updated `JWT_SECRET` in `backend/.env`
- [ ] Updated `CLOUDINARY_*` in `backend/.env`
- [ ] Updated `ARCJET_KEY` in `backend/.env`
- [ ] Updated `VITE_API_URL` in `frontend/.env` (for local dev)
- [ ] Added `VITE_API_URL` in Vercel Dashboard (for production)
- [ ] Backend restarted
- [ ] Vercel redeployed
- [ ] Tested login/signup

---

## 🆘 Need Help?

If you don't have accounts for these services:

### MongoDB Atlas (Free):
https://www.mongodb.com/cloud/atlas/register

### Cloudinary (Free):
https://cloudinary.com/users/register/free

### Arcjet (Free):
https://app.arcjet.com/signup

All have free tiers that work perfectly for this app! 🎉
