# Google OAuth Setup Guide

## ✅ Current Status

**Frontend:** Running on http://localhost:5173  
**Backend:** Running on http://localhost:3000  
**MongoDB:** Connected successfully

## 🔧 Next Steps to Enable Google OAuth

### Step 1: Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - Add Authorized redirect URIs:
     ```
     http://localhost:5173
     ```
   - Click "Create"
   - **COPY THE CLIENT ID** (looks like: xxxxx.apps.googleusercontent.com)

### Step 2: Configure Frontend

**File:** `/Opd_flow/src/main.jsx`

Replace line 9:
```javascript
// FROM:
<GoogleOAuthProvider clientId="your_google_client_id_here">

// TO:
<GoogleOAuthProvider clientId="YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com">
```

### Step 3: Configure Backend

**File:** `/backend/.env`

Replace line 5:
```env
# FROM:
GOOGLE_CLIENT_ID=your_google_client_id_here

# TO:
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
```

### Step 4: Restart Backend

After updating `.env`, restart the backend:
- In the terminal running the backend, press `Ctrl+C`
- Run: `npm run dev` again

The frontend will hot-reload automatically, no restart needed.

### Step 5: Test the Integration

1. Open http://localhost:5173
2. Look at the **Navbar** (top right)
3. You should see a **"Sign in with Google"** button
4. Click it and select your Google account
5. After successful sign-in:
   - The button will change to show your name
   - Click your name to see a dropdown with email and logout option

## 🎯 What You'll See

### Before Sign In (Navbar):
```
[OPDFlow] Home Request Intake [🌙] [Sign in with Google] [Get Started]
```

### After Sign In (Navbar):
```
[OPDFlow] Home Request Intake [🌙] [👤 Your Name ▼] [Get Started]
```

Click on "Your Name" to see:
- Your full name
- Your email address
- Logout button

## 🔍 Testing Checklist

- [ ] Google sign-in button appears in navbar when logged out
- [ ] Click Google button opens Google account selector
- [ ] Successfully sign in with Google account
- [ ] Page refreshes and shows user name in navbar
- [ ] Click user name shows dropdown with email
- [ ] Click logout signs you out
- [ ] After logout, Google sign-in button appears again

## ⚠️ Troubleshooting

### "Google Login Failed"
- Check that Client ID is correct in both frontend and backend
- Verify authorized origins are set in Google Cloud Console
- Make sure both servers are running

### "Invalid Client ID"
- Double-check the Client ID copied from Google Cloud Console
- Ensure no extra spaces or quotes in the configuration

### "Redirect URI mismatch"
- Add `http://localhost:5173` to authorized redirect URIs in Google Cloud Console

## 📝 Current Configuration

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:3000  
**Database:** mongodb://localhost:27017/hospital

**Google Client ID Status:**
- Frontend: ❌ Not configured (using placeholder)
- Backend: ❌ Not configured (using placeholder)

Once you add your real Client ID, both will show ✅

## 🚀 Ready to Go!

Once you complete Steps 1-4 above, your Google OAuth authentication will be fully functional!

The sign-in button is already in the navbar waiting for you.
