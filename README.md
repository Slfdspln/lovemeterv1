# Love Meter v2

A relationship analysis app that processes screenshots of conversations to provide insights into relationship dynamics using OCR, feature extraction, and AI analysis.

## Features

- **Screenshot OCR**: Upload iPhone/Android screenshots and extract conversation text
- **Privacy-First**: All sensitive data redacted locally before any API calls
- **9 Analysis Algorithms**: Sentiment, reciprocity, reply latency, engagement, emojis, momentum, photos, style matching, and toxicity detection
- **Hybrid Scoring**: Local heuristics + optional ChatGPT enhancement
- **Explainable Results**: See exactly what factors contributed to your score
- **Modern UI**: Drag-and-drop uploads, progress tracking, shareable results

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your OpenAI API key
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Open app**: Visit http://localhost:3000

## Project Structure

```
/frontend          # React + TypeScript UI
/backend           # Express API server
/shared            # Shared types and utilities
```

## How It Works

1. **Upload**: Drag-and-drop conversation screenshots
2. **OCR**: Extract text using Tesseract.js
3. **Parse**: Detect message bubbles and extract sender/timestamp/content
4. **Redact**: Replace emails, phones, addresses with placeholders
5. **Analyze**: Compute 9 relationship features locally
6. **Enhance** (optional): Send redacted snippets to ChatGPT for deeper insights
7. **Results**: View score, explanations, and improvement suggestions

## Privacy & Security

- OCR and initial processing happens entirely on-device
- Only redacted snippets and numeric features sent to AI APIs
- No raw conversation data leaves your device without explicit consent
- All uploads can be deleted immediately after analysis

## Development

- `npm run dev` - Start both frontend and backend
- `npm run build` - Build all packages
- `npm run dev:frontend` - Frontend only
- `npm run dev:backend` - Backend only

## License

MIT