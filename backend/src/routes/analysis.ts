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

// Enhanced system prompt with effort balance and personal perspective
const SYSTEM_PROMPT = `You are a careful, privacy-respecting relationship analyst. You receive:
(1) An anonymized, partially redacted snippet of a two-person chat (iMessage-like).
(2) A set of precomputed numeric features describing the conversation.

Your tasks:
- Produce a single 0–100 "relationship vibe score" labeled score.
- Provide a concise, neutral explanation (max 2 sentences).
- Output a short neutral statement written from the user's perspective about effort balance.
- Determine who typically initiates conversations.
- Show effort trend over time for both sides.
- Provide exactly three concrete suggestions that improve communication in this specific context.

Rules:
- Use the numeric features as primary signals; use the text snippet for nuance.
- Do not guess identities or private details. Never include PII.
- If evidence is mixed, be balanced—not harsh, not sugarcoated.
- Reflect reciprocity, reply latency, warmth, conflict presence, and momentum.
- For effort balance, use "You" for person A and "Your partner" for person B.
- Examples of effort balance statements:
  - "You show more effort in keeping the conversation balanced."
  - "Your partner is more consistent with warmth and engagement."
  - "Both you and your partner show balanced effort."
- For initiator tracking, determine who starts conversations more often.
- For trends, assess if effort is "increasing", "stable", or "declining" for each person.
- If toxicity is detected, note responsibility carefully: "Most sharp tones appear in your messages" or "your partner's messages".
- Return strict JSON with keys: score (integer 0–100), explanation (string), effort_balance (string), initiator (string), trend (string), balance_meter (integer 0–100), suggestions (array of exactly 3 short strings). No extra keys, no prose outside JSON.`

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
      typeof parsedResponse.score !== 'number' ||
      typeof parsedResponse.explanation !== 'string' ||
      typeof parsedResponse.effort_balance !== 'string' ||
      typeof parsedResponse.initiator !== 'string' ||
      typeof parsedResponse.trend !== 'string' ||
      typeof parsedResponse.balance_meter !== 'number' ||
      !Array.isArray(parsedResponse.suggestions) ||
      parsedResponse.suggestions.length !== 3
    ) {
      throw new Error('AI response does not match expected format')
    }

    // Clamp scores to valid range
    parsedResponse.score = Math.max(0, Math.min(100, Math.round(parsedResponse.score)))
    parsedResponse.balance_meter = Math.max(0, Math.min(100, Math.round(parsedResponse.balance_meter)))

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