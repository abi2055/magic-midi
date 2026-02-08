# Ghost Writer: The AI Conductor

> **Your AI co-pilot for music composition. It listens to your track in real-time and generates melodic continuations with built-in theory explanations.**
> *Powered by Google Gemini 3*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Click_Here-FF5722?style=for-the-badge&logo=google-cloud)](https://ghost-writer-app.vercel.app/)
[![Video Demo](https://img.shields.io/badge/Video_Demo-Watch-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=AVSv6bKoV1M)
[![Hackathon](https://img.shields.io/badge/Submission-Gemini_3_Hackathon-blue?style=for-the-badge)](https://devpost.com/software/ghost-writer-rqynp6)
[![Google Gemini 3](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/)

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
* Gemini 3 API Key
* Firebase API Key

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

### 6. Navigate to
http://localhost:3000/edit

> **Note:** This project is currently optimized for vercel hosting however pull commit hash **17c8c1c** and the local setup above will work as intended

## Deployment (Public Run)
**This project is optimized for Vercel.**

1. Push your code to a GitHub repository.
   
2. Import the project into Vercel.
   
3. Critical Step: In Vercel Project Settings > Environment Variables, add:
   - Key: GEMINI_API_KEY
   - Value: [Your Google AI Studio Key]
     
4. Deploy

> **Note**: The backend logic lives in api/generate.ts, which Vercel automatically detects and turns into a serverless function.

## Web Run

### Option 1: Vercel hosted Web link (With Gemini Addition)
[https://ghost-writer-app.vercel.app/](https://ghost-writer-app.vercel.app/)

### Option 2: Original Web link (Without the Gemini Integration)
[signalmidi.app](https://signalmidi.app/)

## Basic Usage Workflow

1.  **Start the Editor**
    Launch the application and navigate to the main editor interface. You will see a standard piano roll grid.

2.  **Create Your Context**
    Use the mouse to draw a simple melody or chord progression on the grid. This serves as the context for the AI. For the best results, try adding a simple drum pattern on a separate track to establish a rhythm.

3.  **Trigger the Ghost Writer**
    Locate the AI generation button in the toolbar. Click it to send your current notes to the Gemini model.

4.  **Review the Suggestion**
    The AI will generate a continuation of your track directly on the piano roll. It will also display a "Insight" message that explains the music theory behind the specific notes it chose.

5.  **Play and Edit**
    Press the Play button to listen to the new composition. You can manually adjust, delete, or extend the generated notes to further refine the track.

## Credits & Attribution

* **Original MIDI Editor Core**
    * This project is a fork of [Signal](https://github.com/ryohey/signal) by [Ryohey](https://github.com/ryohey).
    * **License:** MIT. Huge thanks to the original author for the incredible piano roll UI and sequencer engine.

* **AI Integration**
    * Built by @abi2055.
    * Powered by Google Gemini API.

## License
MIT. See [LICENSE](/LICENSE)
