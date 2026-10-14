# 🚀 CareerTrack AI — Setup Guide for Friend's Laptop

## Prerequisites (Install these first)

Your friend needs **Node.js** installed. That's it!

1. Go to: https://nodejs.org
2. Download the **LTS version** (e.g. v20 or v22)
3. Install it — just click Next → Next → Finish

To check if it's installed, open **Command Prompt** and type:
```
node --version
npm --version
```
Both should print version numbers (e.g. v20.x.x).

---

## Steps to Run the App

### Step 1 — Extract the ZIP
Right-click `CareerTrackAI.zip` → **Extract All** → choose a folder (e.g. Desktop)

### Step 2 — Open Terminal in that folder
- Open the extracted folder
- In the address bar of File Explorer, type `cmd` and press Enter
  *(This opens Command Prompt directly in that folder)*

### Step 3 — Install dependencies
```
npm install
```
Wait 1-2 minutes for packages to download.

### Step 4 — Start the app
```
npm run dev
```

### Step 5 — Open in browser
The terminal will show:
```
  VITE v8.x.x  ready in XXXX ms
  Local:   http://localhost:5173/
```
Open your browser and go to: **http://localhost:5173**

---

## Login Credentials

| Account | Email | Password |
|---------|-------|----------|
| Demo User | demo@careertrack.ai | demo123 |
| Admin | admin@careertrack.ai | admin123 |
| New Account | Register your own | Any password |

---

## To Stop the App
Press Ctrl + C in the terminal.

---

## Troubleshooting

**"npm is not recognized"** - Node.js is not installed. Go to nodejs.org and install it.

**"Port 5173 already in use"** - Run: npm run dev -- --port 3000
Then open http://localhost:3000

**Slow first load** - Normal! The first npm install downloads ~70 packages. Subsequent runs are instant.
