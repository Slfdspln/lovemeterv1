export interface Message {
  sender: 'A' | 'B';
  text: string;
  timestamp?: Date;
  emojiList: string[];
  hasPhoto?: boolean;
}

export interface ConversationFeatures {
  sentiment_polarity: number; // 0-100
  reciprocity: number; // 0-100
  length_balance: number; // 0-100
  reply_latency_score: number; // 0-100
  engagement_questions: number; // 0-100
  emoji_intimacy: number; // 0-100
  temporal_momentum: number; // 0-100
  photos_share: number; // 0-100
  style_match: number; // 0-100
  toxicity_hits: number; // raw count
  window_days: number;
  msg_count_A: number;
  msg_count_B: number;
  median_reply_minutes_AtoB: number;
  median_reply_minutes_BtoA: number;
}

export interface FeatureContribution {
  feature: string;
  contribution: number; // -100 to +100
  label: string;
}

export interface LLMResponse {
  score: number; // 0-100
  explanation: string;
  effort_balance: string;
  initiator: string;
  trend: string;
  balance_meter: number; // 0-100
  suggestions: string[]; // exactly 3 items
}

export interface AnalysisResult {
  localScore: number;
  llmScore?: number;
  finalScore: number;
  features: ConversationFeatures;
  contributions: FeatureContribution[];
  explanation: string;
  suggestions: string[];
  effort_balance?: string;
  initiator?: string;
  trend?: string;
  balance_meter?: number;
}

export interface RedactionOptions {
  redactEmails: boolean;
  redactPhones: boolean;
  redactAddresses: boolean;
  redactUrls: boolean;
  redactAmounts: boolean;
}

export interface UploadProgress {
  stage: 'uploading' | 'ocr' | 'parsing' | 'analyzing' | 'complete';
  progress: number; // 0-100
  message?: string;
}