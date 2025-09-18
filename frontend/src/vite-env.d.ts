/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOVE_API_KEY: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}