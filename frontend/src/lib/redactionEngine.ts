import { Message, RedactionOptions } from '@love-meter/shared'

export class RedactionEngine {
  private options: RedactionOptions = {
    redactEmails: true,
    redactPhones: true,
    redactAddresses: true,
    redactUrls: true,
    redactAmounts: true,
  }

  setOptions(options: Partial<RedactionOptions>) {
    this.options = { ...this.options, ...options }
  }

  redactMessage(message: Message): Message {
    let text = message.text

    if (this.options.redactEmails) {
      text = this.redactEmails(text)
    }

    if (this.options.redactPhones) {
      text = this.redactPhones(text)
    }

    if (this.options.redactUrls) {
      text = this.redactUrls(text)
    }

    if (this.options.redactAddresses) {
      text = this.redactAddresses(text)
    }

    if (this.options.redactAmounts) {
      text = this.redactAmounts(text)
    }

    return {
      ...message,
      text
    }
  }

  private redactEmails(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    return text.replace(emailRegex, '[EMAIL]')
  }

  private redactPhones(text: string): string {
    const phonePatterns = [
      // US formats: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890
      /\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g,
      // International: +1 123 456 7890
      /\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g,
    ]

    let result = text
    phonePatterns.forEach(pattern => {
      result = result.replace(pattern, '[PHONE]')
    })

    return result
  }

  private redactUrls(text: string): string {
    const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+|\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}[^\s]*/g
    return text.replace(urlRegex, '[URL]')
  }

  private redactAddresses(text: string): string {
    // Basic address patterns - this could be more sophisticated
    const addressPatterns = [
      // Street addresses: 123 Main St, 456 Oak Avenue
      /\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Circle|Cir|Court|Ct)\b/gi,
      // Zip codes
      /\b\d{5}(-\d{4})?\b/g,
    ]

    let result = text
    addressPatterns.forEach(pattern => {
      result = result.replace(pattern, '[ADDRESS]')
    })

    return result
  }

  private redactAmounts(text: string): string {
    const amountPatterns = [
      // Dollar amounts: $123, $123.45, $1,234.56
      /\$\d{1,3}(,\d{3})*(\.\d{2})?/g,
      // Other currency symbols
      /[€£¥₹]\d+(\.\d{2})?/g,
      // Venmo/payment references
      /paid\s+\$?\d+/gi,
      /sent\s+\$?\d+/gi,
      /owes?\s+\$?\d+/gi,
    ]

    let result = text
    amountPatterns.forEach(pattern => {
      result = result.replace(pattern, '[AMOUNT]')
    })

    return result
  }

  // Helper to create redacted snippet for LLM
  createSnippet(messages: Message[], maxLines: number = 80): string {
    const recentMessages = messages.slice(-maxLines)

    return recentMessages
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join('\n')
  }
}