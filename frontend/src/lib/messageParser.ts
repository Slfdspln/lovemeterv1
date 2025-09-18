import { Message } from '@love-meter/shared'

export class MessageParser {
  parseText(text: string): Message[] {
    const lines = text.split('\n').filter(line => line.trim())
    const messages: Message[] = []

    // Detect if this is iMessage format or generic chat
    const isIMessage = this.detectIMessageFormat(text)

    if (isIMessage) {
      return this.parseIMessageFormat(lines)
    } else {
      return this.parseGenericFormat(lines)
    }
  }

  private detectIMessageFormat(text: string): boolean {
    // Look for common iMessage patterns
    const patterns = [
      /\d{1,2}:\d{2}\s*(AM|PM)/i, // Time stamps
      /today|yesterday/i, // Date indicators
      /delivered|read/i, // Message status
    ]

    return patterns.some(pattern => pattern.test(text))
  }

  private parseIMessageFormat(lines: string[]): Message[] {
    const messages: Message[] = []
    let currentSender: 'A' | 'B' | null = null
    let currentTime: Date | undefined

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      // Skip status lines
      if (/^(delivered|read|typing)/i.test(line)) continue

      // Detect timestamp
      const timeMatch = line.match(/(\d{1,2}:\d{2}\s*(AM|PM))/i)
      if (timeMatch) {
        currentTime = this.parseTime(timeMatch[1])
        continue
      }

      // Detect sender change or new message
      const message = this.extractMessage(line)
      if (message) {
        // Heuristic: if line seems like a new bubble (starts with capital,
        // or is very different from previous), might be sender change
        const sender = this.detectSender(line, currentSender, messages.length)

        messages.push({
          sender,
          text: message,
          timestamp: currentTime,
          emojiList: this.extractEmojis(message),
          hasPhoto: this.detectPhoto(line)
        })

        currentSender = sender
      }
    }

    return messages
  }

  private parseGenericFormat(lines: string[]): Message[] {
    const messages: Message[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Try to detect sender patterns like "John: message" or "You: message"
      const senderMatch = trimmed.match(/^([^:]+):\s*(.+)$/)

      if (senderMatch) {
        const senderName = senderMatch[1].trim()
        const messageText = senderMatch[2].trim()

        // Determine if this is person A or B
        const sender = this.mapSenderName(senderName)

        messages.push({
          sender,
          text: messageText,
          emojiList: this.extractEmojis(messageText),
          hasPhoto: this.detectPhoto(messageText)
        })
      } else {
        // Assume continuation of previous message or standalone
        const sender = messages.length > 0 ? messages[messages.length - 1].sender : 'A'

        messages.push({
          sender,
          text: trimmed,
          emojiList: this.extractEmojis(trimmed),
          hasPhoto: this.detectPhoto(trimmed)
        })
      }
    }

    return messages
  }

  private extractMessage(line: string): string | null {
    // Remove common OCR artifacts and clean up
    let cleaned = line
      .replace(/^\W+/, '') // Remove leading punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Skip very short lines (likely artifacts)
    if (cleaned.length < 2) return null

    // Skip lines that look like UI elements
    if (/^(Message|iMessage|Text Message)$/i.test(cleaned)) return null

    return cleaned
  }

  private detectSender(line: string, currentSender: 'A' | 'B' | null, messageIndex: number): 'A' | 'B' {
    // For simplicity, alternate between A and B
    // In a real implementation, you'd use bubble colors, positioning, etc.

    // If this is the first message, start with A
    if (messageIndex === 0) return 'A'

    // Simple heuristic: if line starts with a capital and follows a pattern,
    // might be a new sender
    if (currentSender === 'A') return 'B'
    return 'A'
  }

  private mapSenderName(senderName: string): 'A' | 'B' {
    // Map common self-references to A
    const selfPatterns = ['you', 'me', 'myself', 'i']

    if (selfPatterns.some(pattern =>
      senderName.toLowerCase().includes(pattern)
    )) {
      return 'A'
    }

    return 'B'
  }

  private parseTime(timeStr: string): Date {
    // Parse time like "3:45 PM"
    const now = new Date()
    const [time, period] = timeStr.split(/\s+/)
    const [hours, minutes] = time.split(':').map(Number)

    let hour24 = hours
    if (period?.toLowerCase() === 'pm' && hours !== 12) {
      hour24 += 12
    } else if (period?.toLowerCase() === 'am' && hours === 12) {
      hour24 = 0
    }

    const result = new Date(now)
    result.setHours(hour24, minutes, 0, 0)

    return result
  }

  private extractEmojis(text: string): string[] {
    // Simple emoji detection - matches Unicode emoji ranges
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu

    return text.match(emojiRegex) || []
  }

  private detectPhoto(text: string): boolean {
    const photoPatterns = [
      /\[?image\]?/i,
      /\[?photo\]?/i,
      /\[?picture\]?/i,
      /📷|📸|🖼️/,
      /sent an image/i,
      /shared a photo/i
    ]

    return photoPatterns.some(pattern => pattern.test(text))
  }

  removeDuplicates(messages: Message[]): Message[] {
    const seen = new Set<string>()
    const unique: Message[] = []

    for (const message of messages) {
      // Create a hash based on last 30 characters to detect overlaps
      const hash = message.text.slice(-30).toLowerCase().replace(/\s+/g, '')

      if (!seen.has(hash)) {
        seen.add(hash)
        unique.push(message)
      }
    }

    return unique
  }
}