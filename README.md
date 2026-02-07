# Ghost Writer: The AI Conductor

> **A real-time AI music companion that jams with you.**
> *Powered by Google Gemini 3 & Vercel Edge Functions.*

## Overview
Ghost Writer is an intelligent music editor that allows users to compose MIDI tracks in the browser. Unlike standard editors, this tool features a **"Ghost Writer"** which is an AI agent that listens to your current track, analyzes the harmony and rhythm of the other instruments (drums, bass, keys), and **instantly generates a continuation** of your melody. It acts as a **Music Theory Teacher** by explaining *why* it chose those notes (e.g., "I landed on the root note to resolve the tension").

## Why This Was Built
This project was built for the **Gemini 3 Hackathon** to explore the boundaries of **Generative Audio** and real-time multimodal interaction. The goal was to solve "Blank Canvas Syndrome" for musicians. Instead of staring at an empty piano roll, users can play a few notes and ask the AI, *"What comes next?"* The result is a collaborative "call and response" loop between human and machine.

## Tech Stack

### Frontend
* **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** TypeScript, HTML and CSS

### AI & Backend
* **Model:** **Google Gemini 3 Flash** (via Google AI Studio)
    * *Why Flash?* Selected for its ultra-low latency, essential for keeping the creative flow uninterrupted.
* **Infrastructure:** [Vercel Edge Functions](https://vercel.com/docs/functions)
    * Used to securely proxy API requests and keep the Google API Key hidden from the client.
* **JS SDK:** `@google/genai`

## Getting Started (Local Run)

Follow these steps to run the "Ghost Writer" locally on your machine.

### 1. Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### 2. Clone 
```bash
git clone https://github.com/abi2055/magic-midi.git
```

### 3. Install (In the project root directory)
```bash
npm install
```

### 4. Gemini and Firebase API Keys (In a .env file set these vars) 
```bash
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
GEMINI_API_KEY=
GOOGLE_CLOUD_LOCATION=
GOOGLE_CLOUD_PROJECT_NUMBER=
GOOGLE_CLOUD_PROJECT=
GOOGLE_GENAI_USE_VERTEXAI=
```

### 4. Build (first time run)
```bash
npm run build
```

### 5. Start the Application
```bash
npm start
```

> **Note:** This project is currently optimized for vercel hosting however pull commit hash **17c8c1c** and the local setup above will work as intended

## Web Run

### Option 1: Vercel hosted Web link (With Gemini Addition)
[https://ghost-writer-app.vercel.app/](https://ghost-writer-app.vercel.app/)

### Option 2: Original Web link (Without the Gemini Integration)
[signalmidi.app](https://signalmidi.app/)

## License
MIT. See [LICENSE](/LICENSE)
