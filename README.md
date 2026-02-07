# Ghost Writer: The AI Conductor

> **A real-time AI music companion that jams with you.**
> *Powered by Google Gemini 3 & Vercel Edge Functions.*

## Overview
Magic MIDI is an intelligent music editor that allows users to compose MIDI tracks in the browser. Unlike standard editors, this tool features a **"Ghost Writer"** which is an AI agent that listens to your current track, analyzes the harmony and rhythm of the other instruments (drums, bass, keys), and **instantly generates a continuation** of your melody.

It doesn't just generate random notes; it acts as a **Music Theory Teacher** by explaining *why* it chose those notes (e.g., "I landed on the root note to resolve the tension").

## Why This Was Built
This project was built for the **Gemini 3 Hackathon** to explore the boundaries of **Generative Audio** and real-time multimodal interaction.

The goal was to solve "Blank Canvas Syndrome" for musicians. Instead of staring at an empty piano roll, users can play a few notes and ask the AI, *"What comes next?"* The result is a collaborative "call and response" loop between human and machine.

## Tech Stack

### Frontend
* **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language:** TypeScript
* **State Management:** MobX
* **Audio Engine:** Web Audio API

### AI & Backend
* **Model:** **Google Gemini 3 Flash** (via Google AI Studio)
    * *Why Flash?* Selected for its ultra-low latency, essential for keeping the creative flow uninterrupted.
* **Infrastructure:** [Vercel Edge Functions](https://vercel.com/docs/functions)
    * Used to securely proxy API requests and keep the Google API Key hidden from the client.
* **SDK:** `@google/genai`

## Getting Started (Local Run)

Follow these steps to run the "Ghost Writer" locally on your machine.

## License
MIT. See [LICENSE](/LICENSE)
