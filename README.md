# 🕉️ Shri Guru Gorakhnath Math - Management & Public Web Platform

A modern, dynamic, real-time Temple Management System and Public Web Portal built with Next.js, React, Tailwind CSS, Lucide Icons, and dual MongoDB/JSON persistence.

---

## 🚀 Key Features

1. **🚩 Public Web Portal**:
   - Multi-language support (Hindi, English, Marathi).
   - Real-time Public Gallery with Lightbox modal view.
   - Dynamic Festival & Events listing (managed via Admin CMS).
   - Real-time Public Financial Ledger (Donations & Expenses transparency).
   - Dynamic Bank Details & PhonePe/GPay/Paytm UPI QR Code scanning for direct donations.

2. **🌐 Website Content Manager (Admin CMS)**:
   - Edit Hero Banner (Title, Subtitle, Tagline, Location).
   - Edit Mandir History & Tradition text.
   - Add/Edit/Delete Festivals & Annual Events.
   - Configure Mandir Address, Timings, Phone, Email & UPI Details.
   - Upload & Manage UPI QR Code image.

3. **🖼️ Gallery Management (`/gallery`)**:
   - Drag & Drop photo upload.
   - Visible / Hide toggle control for public display.
   - Edit title and caption with instant real-time synchronization.

4. **🏗️ Infrastructure & Construction Tracking (`/construction`)**:
   - Track temple expansion projects (Dome Carving, Pilgrim Rest House, Kitchen, etc.).
   - Allocated Budget vs Spent calculation, progress bar %, and status (On Track, Completed, Delayed).

5. **💰 Financial Ledger (`/finance/donations` & `/finance/expenses`)**:
   - Full income & expense management with Passcode security.
   - Filter by date, category, search donor name, export reporting.

---

## 📁 Project Folder Structure

```
mandir_web/
├── data/                    # Dynamic Database Persistence Files
│   ├── site_content.json    # Website CMS content (Hero, History, Festivals, Contact, Bank)
│   ├── gallery.json         # Uploaded gallery images metadata & visibility flags
│   ├── construction.json    # Construction projects tracking dataset
│   ├── ledger.json          # Financial transactions (Income/Expenses)
│   ├── config.json          # Passcode settings
│   └── users.json           # Admin user accounts & RBAC roles
├── public/                  # Public Static & Uploaded Assets
│   ├── gallery/             # Uploaded gallery image files
│   └── uploads/             # QR codes & user uploads
├── src/
│   ├── app/
│   │   ├── page.tsx         # Main Public Website (#home, #itihaas, #gallery, #utsav, #daan)
│   │   ├── dashboard/       # Main Admin Dashboard & Analytics
│   │   │   └── content/     # Website Content Manager (CMS)
│   │   ├── gallery/         # Admin Gallery Manager
│   │   ├── construction/    # Construction Project Manager
│   │   ├── finance/         # Financial Ledger (Donations & Expenses)
│   │   ├── login/           # Admin Authentication Page
│   │   └── api/             # Next.js Serverless API Endpoints
│   ├── components/          # Reusable Layouts (Sidebar, TopBar, RoleGuard)
│   ├── context/             # AuthContext state provider
│   └── lib/                 # Database handlers (db.js, mongodb.js)
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
└── package.json             # NPM dependencies & scripts
```

---

## 🔐 Environment Variables (`.env.local` / `.env.example`)

| Variable Name | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Local server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGODB_URI` | MongoDB Connection URI (Optional) | `mongodb://127.0.0.1:27017/mandir_management` |
| `NEXTAUTH_SECRET` | Authentication Secret Key | `gorakhnath_math_secret_key_108` |

> 💡 **Dual Database Mode**: If `MONGODB_URI` is provided, system stores data in MongoDB Atlas/Cloud DB. If omitted, system seamlessly defaults to lightweight JSON database files inside `/data` directory.

---

## 🚀 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Default Credentials**:
   - **Admin Email**: `admin@mandir.com`
   - **Password**: `mandir@2024`
   - **Ledger Passcode**: `namah108`

---

## 📤 How to Push to GitHub & Deploy to Production

### 1. Push to your GitHub Repository:
Run the following commands in terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mandir_web.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel (Recommended):
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository (`mandir_web`).
3. Add environment variables if using Cloud MongoDB (`MONGODB_URI`).
4. Click **Deploy**. Vercel will automatically build and publish your website!
