# 🚀 EduNet Examination Platform – Deployment Guide

This guide will walk you through deploying your exam website to **Vercel** with a free **Supabase** backend.

---

## 📋 Step 1: Create Free Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account).
2. Click **New Project** and name it `edunet-exam`.
3. In the left sidebar, click **SQL Editor** (`>_`).
4. Click **New Query**, open the file `supabase/migrations/001_exam_schema.sql` from this project, paste its entire contents, and click **Run**.
5. Once completed, navigate to **Project Settings** (gear icon) > **API**.
6. Copy:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **service_role secret key** (Reveal and copy the secret key, NOT the anon key).

---

## 🐙 Step 2: Push to GitHub

The Git repository is already initialized and all files are committed to the `main` branch.

1. Open [https://github.com/new](https://github.com/new) and create a new repository called `edunet-exam` (Public or Private).
2. In your terminal, run:
```powershell
cd "c:\Users\nampa\OneDrive\Documents\web sites\wp\EXAM SITE\edunet"
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/edunet-exam.git
git push -u origin main
```

---

## ▲ Step 3: Deploy to Vercel (Free)

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Select your `edunet-exam` repository and click **Import**.
4. **Framework Preset:** Vercel will auto-detect **Next.js**. Leave as-is.
5. **Build Command:** Leave as default (`npm run build`) — it will automatically use webpack mode.
6. In the **Environment Variables** section, add the following 8 variables:

| Key | Value |
|---|---|
| `SUPABASE_URL` | *Your Supabase Project URL from Step 1* |
| `SUPABASE_SERVICE_ROLE_KEY` | *Your Supabase service_role key from Step 1* |
| `JWT_SECRET` | `EduNet@Sainath2024#SecureJWT_Key_Min32Chars!` |
| `PRIMARY_ADMIN_EMAIL` | `nampallynaren16@gmail.com` |
| `PRIMARY_ADMIN_PASSWORD` | `EduNetAdmin@Naren2024!` |
| `SECONDARY_ADMIN_EMAIL` | `sainathdevath9@gmail.com` |
| `SECONDARY_ADMIN_PASSWORD` | `EduNetAdmin@Sainath2024!` |
| `NEXT_PUBLIC_APP_URL` | *Your Vercel URL after first deploy (e.g. `https://edunet-exam.vercel.app`)* |

7. Click **Deploy**.
6. Within 1 minute, Vercel will give you a live production link (e.g. `https://edunet-exam.vercel.app`).

---

## 🔑 Administrator Credentials

- **Primary Administrator:** `nampallynaren16@gmail.com` | `EduNetAdmin@Naren2024!`
- **Secondary Administrator:** `sainathdevath9@gmail.com` | `EduNetAdmin@Sainath2024!`
- **Admin Dashboard:** `/admin`
- **Student Exam:** `/register`
- **Result Lookup:** `/check-result`
