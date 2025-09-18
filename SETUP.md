# Love Meter v2 - Setup Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment**:
   ```bash
   cp backend/.env.example backend/.env
   ```

   Edit `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Open app**: Visit http://localhost:3000

## Features Implemented

✅ **Screenshot OCR**: Upload iPhone screenshots and extract conversation text
✅ **Privacy-First**: All sensitive data redacted locally before any API calls
✅ **9 Analysis Algorithms**: Comprehensive relationship feature extraction
✅ **Hybrid Scoring**: Local heuristics + optional ChatGPT enhancement
✅ **Explainable Results**: See exactly what factors contributed to your score
✅ **Photos Section**: Dynamic mood-based images that rotate with each analysis
✅ **Modern UI**: Drag-and-drop uploads, progress tracking, shareable results

## Analysis Modes

- **Local**: 100% private processing on your device
- **Hybrid**: Local + AI enhancement (recommended)
- **Cloud**: Server processing for maximum accuracy

## Privacy & Security

- OCR and initial processing happens entirely on-device
- Only redacted snippets and numeric features sent to AI APIs
- No raw conversation data leaves your device without explicit consent
- All uploads can be deleted immediately after analysis

## Development Commands

```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 3001)
npm run build           # Build all packages
npm run install:all     # Install all dependencies
```

## Troubleshooting

### "OpenAI API key missing"
- Make sure you've created `backend/.env` from the example
- Get an API key from https://platform.openai.com/api-keys
- Add it to your `.env` file

### "OCR not working"
- Tesseract.js downloads language data on first use
- Check browser console for download progress
- Try refreshing if it gets stuck

### "Upload failed"
- Make sure files are images (PNG, JPG, etc.)
- Check file sizes aren't too large (< 10MB recommended)
- Clear browser cache if persistent issues

### "Images not loading in Photos section"
- Default SVG placeholder images are included
- Add your own photos to `frontend/public/images/sad/` and `frontend/public/images/cute/`
- Update `frontend/src/config/photos.ts` with your image URLs
- Set `VITE_LOVE_API_KEY` if using external CDN

## Project Structure

```
/frontend          # React + TypeScript UI
  /src/components  # UI components
  /src/lib         # Core processing logic
/backend           # Express API server
  /src/routes      # API endpoints
/shared            # Shared types and utilities
```

## Contributing

This is the complete implementation of the Love Meter v2 specification, including:

- Complete OCR pipeline
- All 9 relationship analysis algorithms
- Privacy-first design with local redaction
- Hybrid AI enhancement
- Modern React UI with progress tracking
- Explainable AI results
- Share functionality

The codebase is ready for production deployment with proper environment configuration.