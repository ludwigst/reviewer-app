# LET Reviewer — Local Setup

## First time setup (do this once)

### 1. Install dependencies
Open Terminal, navigate to this folder, and run:
```
cd let-reviewer
npm install
```

### 2. Add your Gemini API key (free)
- Go to https://aistudio.google.com and sign in with your Google account
- Click "Get API key" → "Create API key"
- Open the `.env` file in this folder
- Replace `your_api_key_here` with your actual key:
```
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxx
```

---

## Running the app

```
npm start
```

You'll see something like:

```
  ✅  LET Reviewer is running!

  Open on your laptop:
     http://localhost:3000

  Open on your phone (same WiFi):
     http://192.168.1.xx:3000
```

Open the phone URL in Safari (iPhone) or Chrome (Android).

---

## Add to your phone home screen

**iPhone (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (box with arrow)
3. Tap "Add to Home Screen"
4. Tap "Add" — done!

**Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the 3-dot menu
3. Tap "Add to Home screen"

It will launch fullscreen like a real app.

---

## Stopping the app
Press `Ctrl + C` in Terminal.

## Notes
- Your laptop must be on and running `npm start` for the phone to connect
- Both devices must be on the same WiFi network
- The `.env` file is in `.gitignore` so your API key is never pushed to GitHub
