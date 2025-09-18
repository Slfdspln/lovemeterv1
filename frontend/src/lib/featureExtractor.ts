import { Message, ConversationFeatures } from '../shared/types'

export class FeatureExtractor {
  private positiveWords = [
    'love', 'amazing', 'wonderful', 'awesome', 'great', 'perfect', 'beautiful',
    'sweet', 'cute', 'adorable', 'fantastic', 'excellent', 'brilliant', 'lovely',
    'happy', 'excited', 'grateful', 'thankful', 'appreciate', 'miss', 'care',
    'special', 'incredible', 'outstanding', 'remarkable', 'fabulous', 'terrific'
  ]

  private negativeWords = [
    'hate', 'angry', 'mad', 'annoyed', 'frustrated', 'upset', 'disappointed',
    'sad', 'hurt', 'never', 'stop', 'quit', 'done', 'over', 'leave', 'go',
    'away', 'wrong', 'bad', 'terrible', 'awful', 'horrible', 'stupid', 'crazy',
    'ridiculous', 'impossible', 'pointless', 'useless', 'waste', 'sorry'
  ]

  private intimateEmojis = ['❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💟', '😘', '😍', '🥰', '😻', '💋']
  private casualEmojis = ['😊', '😄', '😃', '🙂', '👍', '👌', '✨', '🎉']

  extractFeatures(messages: Message[], windowDays: number = 30): ConversationFeatures {

    // Filter to time window if timestamps available
    const filteredMessages = this.filterByTimeWindow(messages, windowDays)
    const filteredA = filteredMessages.filter(m => m.sender === 'A')
    const filteredB = filteredMessages.filter(m => m.sender === 'B')

    return {
      sentiment_polarity: this.calculateSentiment(filteredMessages),
      reciprocity: this.calculateReciprocity(filteredA, filteredB),
      length_balance: this.calculateLengthBalance(filteredA, filteredB),
      reply_latency_score: this.calculateReplyLatency(filteredMessages),
      engagement_questions: this.calculateEngagement(filteredA, filteredB),
      emoji_intimacy: this.calculateEmojiIntimacy(filteredMessages),
      temporal_momentum: this.calculateTemporalMomentum(messages, windowDays),
      photos_share: this.calculatePhotoSharing(filteredMessages),
      style_match: this.calculateStyleMatch(filteredA, filteredB),
      toxicity_hits: this.calculateToxicity(filteredMessages),
      window_days: windowDays,
      msg_count_A: filteredA.length,
      msg_count_B: filteredB.length,
      median_reply_minutes_AtoB: this.calculateMedianReply(filteredMessages, 'A', 'B'),
      median_reply_minutes_BtoA: this.calculateMedianReply(filteredMessages, 'B', 'A')
    }
  }

  private filterByTimeWindow(messages: Message[], windowDays: number): Message[] {
    if (!messages.some(m => m.timestamp)) {
      return messages // No timestamps available
    }

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - windowDays)

    return messages.filter(m => !m.timestamp || m.timestamp >= cutoff)
  }

  private calculateSentiment(messages: Message[]): number {
    let positiveCount = 0
    let negativeCount = 0
    let totalWords = 0

    for (const message of messages) {
      const words = message.text.toLowerCase().split(/\s+/)
      totalWords += words.length

      positiveCount += words.filter(word =>
        this.positiveWords.some(pos => word.includes(pos))
      ).length

      negativeCount += words.filter(word =>
        this.negativeWords.some(neg => word.includes(neg))
      ).length

      // Add emoji sentiment
      positiveCount += message.emojiList.filter(emoji =>
        this.intimateEmojis.includes(emoji) || this.casualEmojis.includes(emoji)
      ).length
    }

    const sentPolarity = (positiveCount - 0.8 * negativeCount) / Math.max(1, totalWords / 50)
    return Math.max(0, Math.min(100, 50 + sentPolarity * 25)) // Scale and clamp
  }

  private calculateReciprocity(messagesA: Message[], messagesB: Message[]): number {
    const countA = messagesA.length
    const countB = messagesB.length

    if (countA === 0 && countB === 0) return 50

    const ratio = Math.min(countA, countB) / Math.max(countA, countB)
    return ratio * 100
  }

  private calculateLengthBalance(messagesA: Message[], messagesB: Message[]): number {
    const lengthA = messagesA.reduce((sum, m) => sum + m.text.length, 0)
    const lengthB = messagesB.reduce((sum, m) => sum + m.text.length, 0)

    if (lengthA === 0 && lengthB === 0) return 50

    const balance = 1 - Math.abs(lengthA - lengthB) / (lengthA + lengthB)
    return balance * 100
  }

  private calculateReplyLatency(messages: Message[]): number {
    const deltas: number[] = []

    for (let i = 1; i < messages.length; i++) {
      const current = messages[i]
      const previous = messages[i - 1]

      // Only calculate if different senders and we have timestamps
      if (current.sender !== previous.sender &&
          current.timestamp && previous.timestamp) {
        const deltaMinutes = (current.timestamp.getTime() - previous.timestamp.getTime()) / (1000 * 60)
        if (deltaMinutes > 0 && deltaMinutes < 1440) { // Within 24 hours
          deltas.push(deltaMinutes)
        }
      }
    }

    if (deltas.length === 0) return 75 // Default good score if no timing data

    const medianDelay = this.median(deltas)

    // Logistic curve favoring quick replies
    let score: number
    if (medianDelay < 15) score = 95
    else if (medianDelay < 60) score = 85
    else if (medianDelay < 360) score = 70
    else score = 40

    return score
  }

  private calculateEngagement(messagesA: Message[], messagesB: Message[]): number {
    const questionsA = messagesA.filter(m => m.text.includes('?')).length
    const questionsB = messagesB.filter(m => m.text.includes('?')).length

    const densityA = messagesA.length > 0 ? questionsA / messagesA.length : 0
    const densityB = messagesB.length > 0 ? questionsB / messagesB.length : 0

    // Higher score when both ask questions
    const avgDensity = (densityA + densityB) / 2
    const balance = Math.min(densityA, densityB) / Math.max(densityA || 0.01, densityB || 0.01)

    return Math.min(100, (avgDensity * 200 + balance * 50))
  }

  private calculateEmojiIntimacy(messages: Message[]): number {
    let intimateCount = 0
    let totalEmojis = 0

    for (const message of messages) {
      totalEmojis += message.emojiList.length

      intimateCount += message.emojiList.filter(emoji =>
        this.intimateEmojis.includes(emoji)
      ).length
    }

    if (totalEmojis === 0) return 30 // Low baseline if no emojis

    const intimacyRatio = intimateCount / totalEmojis
    const frequencyBonus = Math.min(totalEmojis / Math.max(1, messages.length), 1) * 30

    return Math.min(100, intimacyRatio * 70 + frequencyBonus)
  }

  private calculateTemporalMomentum(messages: Message[], windowDays: number): number {
    if (windowDays < 14) return 50 // Need at least 2 weeks for momentum

    const halfWindow = Math.floor(windowDays / 2)
    const recent = this.filterByTimeWindow(messages, halfWindow)
    const previous = this.filterByTimeWindow(messages, windowDays).filter(m =>
      !recent.includes(m)
    )

    const freqRecent = recent.length / halfWindow
    const freqPrevious = previous.length / halfWindow

    if (freqPrevious === 0) return freqRecent > 0 ? 75 : 50

    const momentumRatio = (freqRecent - freqPrevious) / freqPrevious
    return 50 + 50 * Math.tanh(momentumRatio) // Sigmoid scaling
  }

  private calculatePhotoSharing(messages: Message[]): number {
    const photoCount = messages.filter(m => m.hasPhoto).length
    return Math.min(100, (photoCount / Math.max(1, messages.length)) * 500)
  }

  private calculateStyleMatch(messagesA: Message[], messagesB: Message[]): number {
    // Simple style matching based on message length patterns
    const avgLengthA = messagesA.reduce((sum, m) => sum + m.text.length, 0) / Math.max(1, messagesA.length)
    const avgLengthB = messagesB.reduce((sum, m) => sum + m.text.length, 0) / Math.max(1, messagesB.length)

    const lengthSimilarity = 1 - Math.abs(avgLengthA - avgLengthB) / Math.max(avgLengthA, avgLengthB, 1)

    // Emoji usage similarity
    const emojiRateA = messagesA.reduce((sum, m) => sum + m.emojiList.length, 0) / Math.max(1, messagesA.length)
    const emojiRateB = messagesB.reduce((sum, m) => sum + m.emojiList.length, 0) / Math.max(1, messagesB.length)

    const emojiSimilarity = 1 - Math.abs(emojiRateA - emojiRateB) / Math.max(emojiRateA, emojiRateB, 0.1)

    return (lengthSimilarity * 60 + emojiSimilarity * 40)
  }

  private calculateToxicity(messages: Message[]): number {
    const toxicPatterns = [
      /\b(idiot|stupid|dumb|moron|loser|pathetic)\b/gi,
      /\b(shut up|f\*ck|damn|hell)\b/gi,
      /\b(hate you|can't stand|disgusting)\b/gi
    ]

    let toxicCount = 0

    for (const message of messages) {
      for (const pattern of toxicPatterns) {
        const matches = message.text.match(pattern)
        if (matches) toxicCount += matches.length
      }
    }

    return toxicCount
  }

  private calculateMedianReply(messages: Message[], fromSender: 'A' | 'B', toSender: 'A' | 'B'): number {
    const deltas: number[] = []

    for (let i = 1; i < messages.length; i++) {
      const current = messages[i]
      const previous = messages[i - 1]

      if (previous.sender === fromSender &&
          current.sender === toSender &&
          current.timestamp && previous.timestamp) {
        const deltaMinutes = (current.timestamp.getTime() - previous.timestamp.getTime()) / (1000 * 60)
        if (deltaMinutes > 0 && deltaMinutes < 1440) {
          deltas.push(deltaMinutes)
        }
      }
    }

    return deltas.length > 0 ? this.median(deltas) : 0
  }

  private median(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }
}