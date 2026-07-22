# 🟢 easyCRM

A professional lead network CRM tool built with React, Supabase, and Node.js. Capture leads via QR codes, track referral chains, and manage your entire network hierarchy.

---

## ✨ Features

- **🔐 Authentication** — Google OAuth + Email/Password login via Supabase
- **📱 QR Code Lead Capture** — Share a unique QR code; leads self-register by scanning
- **🌳 Network Chain** — Recursive lead hierarchy: see everyone in your downline
- **📊 Dashboard** — Real-time stats, recent leads, conversion tracking
- **👥 Lead Management** — Add, search, filter, and update lead statuses
- **🗺️ Network Visualization** — Interactive tree view of your entire lead network
- **⚡ Fast & Professional** — Built with Vite, TailwindCSS, and Lucide icons

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | TailwindCSS v4 |
| Icons | Lucide React |
| Auth & Database | Supabase (PostgreSQL) |
| Backend | Node.js Serverless (Vercel) |
| QR Code | qrcode.react |
| Hosting | Vercel |

---

## 📁 Project Structure

```
easyCRM/
├── frontend/          # React + Vite frontend app
├── backend/           # Node.js serverless API functions
├── supabase/          # Database migrations & schema
├── README.md
├── SETUP.md           # Detailed setup instructions
└── .gitignore
```

---

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/easyCRM.git
   cd easyCRM
   ```

2. **Follow the setup guide** → See [SETUP.md](./SETUP.md) for detailed instructions

3. **Start the frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Start the backend** (optional, for local dev)
   ```bash
   cd backend
   npm install
   npx vercel dev
   ```

---

## 🔄 How It Works

1. **Sign Up** — Create an account with Google or email
2. **Get Your QR Code** — Go to Profile to see your unique QR code
3. **Share** — Use the QR code in promotions, ads, or events
4. **Leads Self-Register** — People scan the QR and fill out a simple form
5. **Track Network** — See all leads and their sub-leads in a tree view
6. **Manage** — Update statuses, add notes, and convert leads

---

## 📄 License

MIT License — feel free to use and modify.
