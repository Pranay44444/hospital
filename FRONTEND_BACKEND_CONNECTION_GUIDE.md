# Frontend-Backend Connection Guide

## ✅ Code Changes Completed

I've updated your frontend code to work with both local development and production environments.

### Files Modified:
1. **`src/services/api.js`** - Updated API base URL to use environment variables
2. **`src/pages/Consultation.jsx`** - Updated hardcoded URLs to use environment variables
3. **`.env.production`** - Created with your Railway backend URL

---

## 📋 Step-by-Step Instructions for Vercel Deployment

### Step 1: Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Click on your project (the frontend deployment)
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://hospital-production-9034.up.railway.app/api`
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
5. Click **Save**

### Step 2: Redeploy Your Frontend

After adding the environment variable, you need to redeploy:

**Option A - From Vercel Dashboard:**
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**

**Option B - From Your Local Code:**
```bash
cd /Users/apple/Desktop/hospital/Opd_flow
git add .
git commit -m "Configure backend API URL for production"
git push
```

Vercel will automatically redeploy when you push to your repository.

### Step 3: Verify Connection

After redeployment:
1. Visit your Vercel URL
2. Try to register/login
3. Check browser console (F12) for any errors
4. Test creating appointments, etc.

---

## 🔧 Backend CORS Configuration (If Needed)

If you get CORS errors, you need to update your backend to allow requests from Vercel.

**In Railway:**
1. Go to your Railway project
2. Click on **Variables** tab
3. Add environment variable:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://your-vercel-app-url.vercel.app`
4. Redeploy backend

Then update your backend code (`index.js`):
```javascript
// Replace line 9:
app.use(cors());

// With:
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
```

---

## 🎯 Testing Locally

For local development, your frontend will automatically use:
- `http://localhost:8080/api` (the default fallback)

Make sure your backend is running on port 8080 locally.

---

## ✅ Checklist

- [x] Updated frontend code to use environment variables
- [x] Created `.env.production` file with Railway URL
- [ ] Add `VITE_API_URL` in Vercel environment variables
- [ ] Redeploy frontend on Vercel
- [ ] Test the connection
- [ ] (Optional) Update backend CORS if needed

---

## 🚨 Troubleshooting

**Frontend can't connect to backend:**
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure Railway backend is running
- Check CORS configuration

**CORS errors:**
- Update backend CORS to include your Vercel URL
- Redeploy backend after changes

**Environment variable not working:**
- Make sure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check Vercel build logs
