# Deployment Guide

## Problem: Netlify Build Limit Exceeded

Netlify free tier has limited builds per month (300 minutes). Here are alternatives:

---

## ✅ Option 1: Vercel (Recommended)

**Pros:** Unlimited builds, fast, easy setup
**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build settings:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables (if needed)
5. Deploy!

**Config file:** `vercel.json` (already created)

---

## ✅ Option 2: GitHub Pages (Free, Unlimited)

**Pros:** Completely free, unlimited builds
**Steps:**
1. Go to your repo Settings → Pages
2. Source: GitHub Actions
3. Push code - auto deploys via `.github/workflows/deploy.yml`
4. Access at: `https://yourusername.github.io/repo-name`

**Note:** For custom domain, add `CNAME` file in `frontend/public/`

---

## ✅ Option 3: Render

**Pros:** Free tier, easy setup
**Steps:**
1. Go to [render.com](https://render.com)
2. New → Static Site
3. Connect GitHub repo
4. Use `render.yaml` config (already created)
5. Deploy!

---

## ✅ Option 4: Cloudflare Pages

**Pros:** Unlimited builds, fast CDN
**Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect GitHub
3. Build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Build output: `frontend/dist`
4. Deploy!

---

## 🔧 Local Testing (Avoid Deploys)

Test locally before deploying:

```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

Build and preview production:
```bash
cd frontend
npm run build
npm run preview
```

---

## 💡 Tips to Reduce Netlify Builds

1. **Test locally first** - Don't deploy every small change
2. **Use feature branches** - Only deploy from `main` branch
3. **Disable auto-deploy** - Deploy manually when ready
4. **Use Vercel instead** - Unlimited builds on free tier

---

## Current Setup

- **Backend:** Deployed on Sevalla/Render
- **Frontend:** Currently on Netlify (consider switching to Vercel)
- **Database:** MongoDB Atlas

## Recommended Migration

**Netlify → Vercel:**
1. Import repo to Vercel
2. Update environment variables
3. Update backend CORS to allow Vercel domain
4. Delete Netlify site (optional)

Done! ✅
