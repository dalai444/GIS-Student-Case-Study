# Insurance Career Match

A simple web app that helps people discover insurance industry roles that fit their skills, interests, and experience. It’s designed to support the industry’s workforce by making it easier for people from other fields to see how they can transfer into insurance.

## What it does

- **You enter:** skills, interests, types of work you enjoy, age (optional), previous work experience, and any extra context.
- **The app:** sends that profile to the Gemini API and returns **personalized job recommendations** within the insurance industry (e.g., claims, underwriting, risk, customer service), with short explanations and next steps.

## Setup

### 1. Install dependencies

```bash
cd "Transferrable Skills Web App"
npm install
```

### 2. Gemini API key

- Get an API key from [Google AI Studio](https://aistudio.google.com/apikey).
- Create a `.env` file in this folder (copy from `.env.example`):

```bash
GEMINI_API_KEY=your-actual-key-here
```

**Important:** Never commit `.env` or share your API key. `.env` is listed in `.gitignore`.

### 3. Run the app

```bash
npm start
```

Then open **http://localhost:3000** in your browser.

## Project structure

| File / folder   | Purpose |
|-----------------|--------|
| `index.html`    | Form and layout |
| `styles.css`    | Styling |
| `app.js`        | Form handling and API calls to the backend |
| `server.js`     | Express server: serves the app and `/api/recommend` (Gemini) |
| `package.json` | Dependencies and scripts |
| `.env`          | Your Gemini API key (you create this, not in git) |

## API

- **POST `/api/recommend`**  
  - Body: JSON with `skills`, `interests`, `work_preferences`, `age`, `experience`, `additional`, etc.  
  - Response: `{ "recommendation": "…" }` or `{ "error": "…" }`.

## Notes

- The backend uses **gemini-2.5-flash** by default (good balance of cost and quality). You can change the model in `server.js` if you prefer (e.g. `gemini-2.5-pro`).
- If `GEMINI_API_KEY` is not set, the server still runs but the recommend endpoint returns a 503 with instructions to set the key.
