// Pools of image URLs (local assets or CDN). Add as many as you want.
export const SAD_PHOTOS = [
  "/images/sad/IMG_0673.JPG",
  "/images/sad/IMG_0674.JPG",
  "/images/sad/IMG_0675.JPG",
  "/images/sad/IMG_0676.JPG",
  "/images/sad/IMG_0677.JPG",
  "/images/sad/IMG_0678.JPG",
  "/images/sad/IMG_0679.JPG",
];

export const CUTE_PHOTOS = [
  "/images/cute/4DF2C974-C13C-4532-9DEC-5C3E1EBE7094.GIF",
  "/images/cute/IMG_0667.JPG",
  "/images/cute/IMG_0669.JPG",
  "/images/cute/IMG_0671.JPG",
  "/images/cute/IMG_0672.JPG",
  "/images/cute/IMG_0681.JPG",
  "/images/cute/IMG_0682.JPG",
  "/images/cute/IMG_0683.JPG",
  "/images/cute/IMG_0684.JPG",
];

// Read API key for any external calls (score service, signed CDN, etc.)
export const LOVE_API_KEY = import.meta.env.VITE_LOVE_API_KEY ?? "";