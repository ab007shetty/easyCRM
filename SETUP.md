# 🟢 easyCRM — Setup Instructions

Follow these steps to get easyCRM running locally and deploy to Vercel.

---

## Prerequisites

- **Node.js** v18+ installed
- **npm** v9+ installed
- A **Supabase** account ([supabase.com](https://supabase.com))
- A **Vercel** account ([vercel.com](https://vercel.com))
- A **Google Cloud** project (for Google OAuth)

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Choose your organization, name it `easyCRM`, set a database password
4. Wait for the project to be created
5. Copy these values from **Settings → API**:
   - `Project URL` → This is your `SUPABASE_URL`
   - `anon public key` → This is your `SUPABASE_ANON_KEY`
   - `service_role secret key` → This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep secret!)

---

## Step 2: Run the Database Migration

1. In your Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase/migrations/001_easyCRM_schema.sql`
3. Copy and paste the entire contents into the SQL Editor
4. Click **"Run"**
5. Verify tables were created under **Table Editor** (you should see `profiles` and `leads`)

---

## Step 3: Enable & Configure Email Authentication

### Enable Email Provider
1. In your Supabase Dashboard, navigate to **Authentication → Providers → Email**
2. Ensure **Email Provider** is toggled **ON**
3. Ensure **Confirm email** is:
   - **OFF** (Disabled) for easier local development (this allows users to register and sign in immediately without verifying their email address)
   - **ON** (Enabled) for production deployments

### Configure Password Recovery Email Template
1. Go to **Authentication → Email Templates**
2. Select the **Reset Password** template
3. Keep the redirect setup in mind. When a user clicks the password reset link, they will be redirected to the site's URL with the recovery tokens appended. Our app is set up to handle recovery automatically via the `/reset-password` route.

### Configure Redirect URLs
1. In your Supabase Dashboard, navigate to **Authentication → URL Configuration**
2. Set **Site URL**: `http://localhost:5173` (Update to your custom domain or frontend Vercel URL in production)
3. Add the redirect paths to the **Redirect URLs** list:
   - `http://localhost:5173/**`
   - `https://your-app.vercel.app/**`

---

## Step 4: Configure Environment Variables

### Frontend
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## Step 5: Install & Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

### Backend (optional for local dev)
```bash
cd backend
npm install
npx vercel dev
```
Backend runs at `http://localhost:3000`

---

## Step 6: Deploy to Vercel

### Frontend Deployment
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your Git repository
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (your Vercel URL)
5. Deploy!

### Backend Deployment
1. Add another project in Vercel
2. Import the same repository
3. Set **Root Directory** to `backend`
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy!

### Post-Deployment
1. Update Supabase **Site URL** to your frontend Vercel URL
2. Update `VITE_APP_URL` in frontend environment variables
3. Add your production URL to the **Redirect URLs** list in Supabase URL Configuration (e.g. `https://your-app.vercel.app/**`)

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|---------|
| Password reset link redirects to localhost | Ensure **Site URL** and **Redirect URLs** in Supabase are updated to your production deployment URL |
| "Invalid API key" error | Verify `.env` files have correct Supabase keys |
| Database tables missing | Re-run the SQL migration in Supabase SQL Editor |
| QR code not generating | Ensure `VITE_APP_URL` is set correctly |
| CORS errors on API calls | Check `vercel.json` CORS headers in backend |

---

## 📝 Notes

- The `service_role` key should **NEVER** be exposed in the frontend. It's only used in the backend serverless functions.
- For production, always enable email confirmation in Supabase Auth settings.
- The QR code encodes the URL: `{APP_URL}/join/{referral_code}`
