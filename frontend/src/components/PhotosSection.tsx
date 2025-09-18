import React from "react";
import { SAD_PHOTOS, CUTE_PHOTOS, LOVE_API_KEY } from "../config/photos";

// Simple rotation counter persisted between runs
function nextIndex(key: string, max: number) {
  if (max === 0) return 0;
  const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  const n = raw ? parseInt(raw, 10) : 0;
  const idx = n % max;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, String(n + 1));
  }
  return idx;
}

function pickPhoto(score: number) {
  if (score < 50) {
    const idx = nextIndex("sad-photo-idx", SAD_PHOTOS.length);
    return { url: SAD_PHOTOS[idx], alt: "Sad mood", type: "sad" };
  } else {
    const idx = nextIndex("cute-photo-idx", CUTE_PHOTOS.length);
    return { url: CUTE_PHOTOS[idx], alt: "Cute & happy", type: "cute" };
  }
}

type PhotosSectionProps = {
  score: number;          // 0–100
};

const PhotosSection: React.FC<PhotosSectionProps> = ({ score }) => {
  const { url, alt, type } = pickPhoto(score);

  // Example: show API key usage is wired (don't actually render the key)
  const apiKeyInUse = Boolean(LOVE_API_KEY);

  const getMoodEmoji = () => {
    if (score >= 85) return "💖";
    if (score >= 70) return "💙";
    if (score >= 50) return "💛";
    return "💔";
  };

  const getMoodText = () => {
    if (score >= 85) return "Amazing connection!";
    if (score >= 70) return "Great relationship vibes";
    if (score >= 50) return "Keep nurturing your bond";
    return "Time to reconnect";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{getMoodEmoji()}</span>
        <h3 className="text-xl font-semibold">Relationship Vibe</h3>
      </div>

      <p className="text-gray-700 mb-6 text-center">
        {getMoodText()}
      </p>

      {/* Photos section */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <div className="relative">
          <img
            src={url}
            alt={alt}
            className="w-full h-64 object-cover"
            onError={(e) => {
              // Fallback to a solid color if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback div if image fails */}
          <div className={`hidden w-full h-64 ${type === 'sad' ? 'bg-gray-300' : 'bg-pink-200'} flex items-center justify-center`}>
            <span className="text-4xl">
              {type === 'sad' ? '😔' : '😊'}
            </span>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Photos rotate each analysis
            </span>
            <span className="text-xs text-gray-500">
              Mood: {type === 'sad' ? 'Needs attention' : 'Positive vibes'}
            </span>
          </div>
        </div>
      </div>

      {/* Development info - only show in dev mode */}
      {import.meta.env.DEV && (
        <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded p-2">
          <div>API key: {apiKeyInUse ? "✅ configured" : "❌ missing — set VITE_LOVE_API_KEY"}</div>
          <div>Photo pool: {type === 'sad' ? `Sad (${SAD_PHOTOS.length} images)` : `Cute (${CUTE_PHOTOS.length} images)`}</div>
        </div>
      )}
    </div>
  );
};

export default PhotosSection;