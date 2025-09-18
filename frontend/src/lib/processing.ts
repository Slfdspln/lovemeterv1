import { createWorker } from 'tesseract.js'
import { AnalysisResult, Message, UploadProgress, LLMResponse, RedactionOptions } from '../shared/types'
import { MessageParser } from './messageParser'
import { FeatureExtractor } from './featureExtractor'
import { RedactionEngine } from './redactionEngine'
import { ScoringEngine } from './scoringEngine'

export class ProcessingEngine {
  private parser = new MessageParser()
  private redactor = new RedactionEngine()
  private extractor = new FeatureExtractor()
  private scorer = new ScoringEngine()
  private mode: 'local' | 'hybrid' | 'cloud' = 'local'

  setMode(mode: 'local' | 'hybrid' | 'cloud') {
    this.mode = mode
  }

  setRedactionOptions(options: RedactionOptions) {
    this.redactor.setOptions(options)
  }

  async processScreenshots(
    files: File[],
    onProgress: (progress: UploadProgress) => void
  ): Promise<AnalysisResult> {
    // Stage 1: OCR
    onProgress({ stage: 'ocr', progress: 0 })
    const extractedTexts: string[] = []

    for (let i = 0; i < files.length; i++) {
      const text = await this.extractTextFromImage(files[i])
      extractedTexts.push(text)
      onProgress({
        stage: 'ocr',
        progress: Math.round(((i + 1) / files.length) * 100),
        message: `Processed ${i + 1} of ${files.length} images`
      })
    }

    // Stage 2: Parse messages
    onProgress({ stage: 'parsing', progress: 0 })
    const allMessages: Message[] = []

    for (let i = 0; i < extractedTexts.length; i++) {
      const messages = this.parser.parseText(extractedTexts[i])
      allMessages.push(...messages)
      onProgress({
        stage: 'parsing',
        progress: Math.round(((i + 1) / extractedTexts.length) * 100)
      })
    }

    // Remove duplicates
    const uniqueMessages = this.parser.removeDuplicates(allMessages)

    // Stage 3: Redaction
    const redactedMessages = uniqueMessages.map(msg =>
      this.redactor.redactMessage(msg)
    )

    // Stage 4: Feature extraction
    onProgress({ stage: 'analyzing', progress: 0 })
    const features = this.extractor.extractFeatures(redactedMessages)
    onProgress({ stage: 'analyzing', progress: 50 })

    // Stage 5: Scoring
    let result = this.scorer.computeScore(features, redactedMessages)
    onProgress({ stage: 'analyzing', progress: 75 })

    // Stage 6: AI Enhancement (if hybrid/cloud mode)
    if (this.mode === 'hybrid' || this.mode === 'cloud') {
      try {
        const snippet = this.redactor.createSnippet(redactedMessages, 80)
        const llmResponse = await this.callAIAPI(features, snippet)

        result = this.scorer.blendWithLLM(result, llmResponse)
      } catch (error) {
        console.warn('AI enhancement failed, using local analysis only:', error)
        // Continue with local analysis if AI fails
      }
    }

    onProgress({ stage: 'analyzing', progress: 100 })
    onProgress({ stage: 'complete', progress: 100 })

    return result
  }

  private async extractTextFromImage(file: File): Promise<string> {
    const worker = await createWorker('eng', 1, {
      logger: () => {} // Disable logging
    })

    try {
      const { data: { text } } = await worker.recognize(file)
      return text
    } finally {
      await worker.terminate()
    }
  }

  async processText(
    text: string,
    onProgress: (progress: UploadProgress) => void
  ): Promise<AnalysisResult> {
    onProgress({ stage: 'parsing', progress: 0 })

    const messages = this.parser.parseText(text)
    onProgress({ stage: 'parsing', progress: 50 })

    const redactedMessages = messages.map(msg =>
      this.redactor.redactMessage(msg)
    )
    onProgress({ stage: 'analyzing', progress: 0 })

    const features = this.extractor.extractFeatures(redactedMessages)
    onProgress({ stage: 'analyzing', progress: 50 })

    let result = this.scorer.computeScore(features, redactedMessages)
    onProgress({ stage: 'analyzing', progress: 75 })

    // AI Enhancement (if hybrid/cloud mode)
    if (this.mode === 'hybrid' || this.mode === 'cloud') {
      try {
        const snippet = this.redactor.createSnippet(redactedMessages, 80)
        const llmResponse = await this.callAIAPI(features, snippet)

        result = this.scorer.blendWithLLM(result, llmResponse)
      } catch (error) {
        console.warn('AI enhancement failed, using local analysis only:', error)
      }
    }

    onProgress({ stage: 'complete', progress: 100 })

    return result
  }

  private async callAIAPI(features: any, redactedSnippet: string): Promise<LLMResponse> {
    const response = await fetch('/api/analysis/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        features,
        redactedSnippet
      })
    })

    if (!response.ok) {
      throw new Error(`AI API call failed: ${response.status}`)
    }

    return response.json()
  }
}