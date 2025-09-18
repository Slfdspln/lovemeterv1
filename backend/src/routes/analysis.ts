import express from 'express'
import OpenAI from 'openai'
import { ConversationFeatures, LLMResponse } from '@love-meter/shared'

const router = express.Router()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnalysisRequest {
  features: ConversationFeatures
  redactedSnippet: string
}

// Relationship Balance Analyzer system prompt
const SYSTEM_PROMPT = `SYSTEM PROMPT — Relationship Balance Analyzer

You are a neutral, structured relationship analyst. You receive inputs from:
- Text messages
- Screenshots (OCR-extracted text)
- Audio (transcribed text)

These inputs represent a two-person conversation. Your task is to evaluate the balance of affection and emotional investment, then decide which partner appears to show more care, warmth, and commitment.

Rules & Outputs:
1. Label participants as **A** (first speaker) and **B** (the partner).
2. Assign each a **Relationship Score** (0–100). Higher scores = greater overall display of love/affection/investment.
3. Consider **all forms of positive expression**, not just the word "love":
   - Compliments, praise, gratitude
   - Acts of care, sacrifice, or support
   - Emotional vulnerability, sharing, reassurance
   - Initiative (who starts, maintains, or deepens conversations)
   - Affectionate tone, warmth, emojis, humor
   - Consistency of attention and responsiveness
4. Output JSON only in this structure:
{
  "who_loves_more": "A" | "B" | "Balanced" | "Unclear",
  "confidence": <0–100>,
  "scores": {"A": <0–100>, "B": <0–100>},
  "summary": "<1–2 sentences explaining the verdict in general terms>",
  "top_evidence": [
    {"speaker": "A", "source": "text|screenshot|audio", "text": "short excerpt"},
    {"speaker": "B", "source": "text|screenshot|audio", "text": "short excerpt"}
  ],
  "suggestions": [
    "Suggestion #1 for improving balance",
    "Suggestion #2",
    "Suggestion #3"
  ]
}
5. Tie-break: if scores differ by ≤5 points, result = "Balanced" with confidence ≤60.
6. If transcripts from screenshots or audio are low-quality, note "uncertain transcription" in the summary and reduce confidence.
7. Ignore irrelevant third-party content unless it directly shows affection between A and B.
8. If safety concerns (abuse, threats, self-harm) appear, override analysis: set "summary": "SAFETY_FLAG" and "confidence": 100.

Tone Adjustment Rules:
- If either partner uses explicit affectionate phrases ("I love you", "miss you", compliments, care, humor, playful intimacy), then weight these positively and ensure the analysis highlights them.
- Never conclude "Needs Work" only because of short sample size or frequency imbalance. Instead, note: "Limited data may not fully reflect relationship balance."
- Use encouraging language in the summary, even if scores are low. (e.g., "This conversation shows signs of care and affection, though balance in frequency could improve.")

End of system prompt.`

router.post('/enhance', async (req, res) => {
  try {
    const { features, redactedSnippet }: AnalysisRequest = req.body

    if (!features || !redactedSnippet) {
      return res.status(400).json({
        error: 'Missing required fields: features and redactedSnippet'
      })
    }

    // Validate features object
    const requiredFeatures = [
      'sentiment_polarity', 'reciprocity', 'length_balance', 'reply_latency_score',
      'engagement_questions', 'emoji_intimacy', 'temporal_momentum', 'photos_share',
      'style_match', 'toxicity_hits', 'window_days', 'msg_count_A', 'msg_count_B',
      'median_reply_minutes_AtoB', 'median_reply_minutes_BtoA'
    ]

    for (const field of requiredFeatures) {
      if (!(field in features)) {
        return res.status(400).json({
          error: `Missing required feature: ${field}`
        })
      }
    }

    // Create the user prompt using the exact template from specification
    const userPrompt = `Conversation (redacted snippet, most recent messages first, up to ~80 lines):
${redactedSnippet}

Numeric features (0–100 scale unless noted):
{
  "sentiment_polarity": ${features.sentiment_polarity},
  "reciprocity": ${features.reciprocity},
  "length_balance": ${features.length_balance},
  "reply_latency_score": ${features.reply_latency_score},
  "engagement_questions": ${features.engagement_questions},
  "emoji_intimacy": ${features.emoji_intimacy},
  "temporal_momentum": ${features.temporal_momentum},
  "photos_share": ${features.photos_share},
  "style_match": ${features.style_match},
  "toxicity_hits": ${features.toxicity_hits},
  "window_days": ${features.window_days},
  "msg_count_A": ${features.msg_count_A},
  "msg_count_B": ${features.msg_count_B},
  "median_reply_minutes_AtoB": ${features.median_reply_minutes_AtoB},
  "median_reply_minutes_BtoA": ${features.median_reply_minutes_BtoA}
}

Constraints:
- If toxicity_hits is high, reflect that carefully in the explanation and score.
- Prefer to calibrate scores such that 50 = neutral, 70 = healthy, 85+ = excellent.`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 500,
      temperature: 0.3,
    })

    const responseText = completion.choices[0]?.message?.content

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let parsedResponse: LLMResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI model')
    }

    // Validate response structure
    if (
      !['A', 'B', 'Balanced', 'Unclear'].includes(parsedResponse.who_loves_more) ||
      typeof parsedResponse.confidence !== 'number' ||
      typeof parsedResponse.scores !== 'object' ||
      typeof parsedResponse.scores.A !== 'number' ||
      typeof parsedResponse.scores.B !== 'number' ||
      typeof parsedResponse.summary !== 'string' ||
      !Array.isArray(parsedResponse.top_evidence) ||
      parsedResponse.top_evidence.length !== 2 ||
      !Array.isArray(parsedResponse.suggestions) ||
      parsedResponse.suggestions.length !== 3
    ) {
      throw new Error('AI response does not match expected format')
    }

    // Clamp scores to valid range
    parsedResponse.confidence = Math.max(0, Math.min(100, Math.round(parsedResponse.confidence)))
    parsedResponse.scores.A = Math.max(0, Math.min(100, Math.round(parsedResponse.scores.A)))
    parsedResponse.scores.B = Math.max(0, Math.min(100, Math.round(parsedResponse.scores.B)))

    res.json(parsedResponse)

  } catch (error) {
    console.error('Analysis enhancement error:', error)

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(401).json({ error: 'Invalid API key configuration' })
      }
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        return res.status(429).json({ error: 'API rate limit exceeded. Please try again later.' })
      }
    }

    res.status(500).json({
      error: 'Failed to enhance analysis',
      message: 'AI service temporarily unavailable'
    })
  }
})

// Test endpoint for development
if (process.env.NODE_ENV === 'development') {
  router.get('/test', (req, res) => {
    res.json({
      message: 'Analysis API is working',
      openaiConfigured: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString()
    })
  })
}

export { router as aiAnalysisRouter }