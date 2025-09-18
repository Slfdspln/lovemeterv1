import { AnalysisResult, ConversationFeatures, FeatureContribution, Message } from '../shared/types'

export class ScoringEngine {
  private featureWeights = {
    sentiment_polarity: 0.25,
    reciprocity: 0.15,
    length_balance: 0.10,
    reply_latency_score: 0.15,
    engagement_questions: 0.10,
    emoji_intimacy: 0.10,
    temporal_momentum: 0.07,
    photos_share: 0.05,
    style_match: 0.03
  }

  private featureLabels = {
    sentiment_polarity: 'Positive sentiment & warmth',
    reciprocity: 'Balanced conversation frequency',
    length_balance: 'Similar message lengths',
    reply_latency_score: 'Quick response times',
    engagement_questions: 'Active engagement & questions',
    emoji_intimacy: 'Affectionate emojis',
    temporal_momentum: 'Growing conversation frequency',
    photos_share: 'Photo sharing',
    style_match: 'Similar communication styles'
  }

  computeScore(features: ConversationFeatures, messages: Message[]): AnalysisResult {
    // Calculate local weighted score
    const localScore = this.calculateLocalScore(features)

    // Calculate feature contributions for explainability
    const contributions = this.calculateContributions(features)

    // Generate explanation and suggestions
    const { explanation, suggestions } = this.generateInsights(features, contributions, messages)

    // Apply toxicity cap if needed
    const cappedScore = this.applyToxicityCap(localScore, features.toxicity_hits)

    return {
      localScore: cappedScore,
      finalScore: cappedScore, // Will be updated if LLM is used
      features,
      contributions,
      explanation,
      suggestions
    }
  }

  private calculateLocalScore(features: ConversationFeatures): number {
    let weightedSum = 0
    let totalWeight = 0

    for (const [feature, weight] of Object.entries(this.featureWeights)) {
      const value = features[feature as keyof ConversationFeatures] as number
      weightedSum += value * weight
      totalWeight += weight
    }

    return Math.round(weightedSum / totalWeight)
  }

  private calculateContributions(features: ConversationFeatures): FeatureContribution[] {
    const contributions: FeatureContribution[] = []

    for (const [feature, weight] of Object.entries(this.featureWeights)) {
      const value = features[feature as keyof ConversationFeatures] as number
      const contribution = weight * (value - 50) * 2 // Scale contribution

      contributions.push({
        feature,
        contribution: Math.round(contribution),
        label: this.featureLabels[feature as keyof typeof this.featureLabels]
      })
    }

    // Sort by absolute contribution (most impactful first)
    return contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
  }

  private generateInsights(
    features: ConversationFeatures,
    contributions: FeatureContribution[],
    messages: Message[]
  ): { explanation: string; suggestions: string[] } {
    const topContributions = contributions.slice(0, 3)
    const positiveFactors = topContributions.filter(c => c.contribution > 0)
    const negativeFactors = topContributions.filter(c => c.contribution < 0)

    // Generate explanation
    let explanation = this.generateExplanation(features, positiveFactors, negativeFactors)

    // Generate suggestions
    const suggestions = this.generateSuggestions(features, negativeFactors, messages)

    return { explanation, suggestions }
  }

  private generateExplanation(
    features: ConversationFeatures,
    positiveFactors: FeatureContribution[],
    negativeFactors: FeatureContribution[]
  ): string {
    const score = this.calculateLocalScore(features)

    let level: string
    if (score >= 85) level = 'excellent'
    else if (score >= 70) level = 'healthy'
    else if (score >= 50) level = 'neutral'
    else level = 'challenging'

    const parts: string[] = [`Your conversation shows ${level} relationship dynamics`]

    if (positiveFactors.length > 0) {
      const strongest = positiveFactors[0]
      parts.push(`with strong ${strongest.label.toLowerCase()}`)
    }

    if (negativeFactors.length > 0) {
      const weakest = negativeFactors[0]
      parts.push(`though ${weakest.label.toLowerCase()} could improve`)
    }

    return parts.join(' ') + '.'
  }

  private generateSuggestions(
    features: ConversationFeatures,
    negativeFactors: FeatureContribution[],
    messages: Message[]
  ): string[] {
    const suggestions: string[] = []

    // Priority-based suggestions based on worst factors
    for (const factor of negativeFactors.slice(0, 2)) {
      const suggestion = this.getSuggestionForFactor(factor.feature, features, messages)
      if (suggestion) suggestions.push(suggestion)
    }

    // Always add a general positive suggestion
    const generalSuggestion = this.getGeneralSuggestion(features)
    suggestions.push(generalSuggestion)

    return suggestions.slice(0, 3) // Exactly 3 suggestions as per spec
  }

  private getSuggestionForFactor(
    feature: string,
    features: ConversationFeatures,
    _messages: Message[]
  ): string | null {
    switch (feature) {
      case 'sentiment_polarity':
        return 'Try adding more positive words and emojis to brighten your conversations'

      case 'reciprocity':
        const imbalanced = features.msg_count_A > features.msg_count_B ? 'B' : 'A'
        return `Encourage ${imbalanced === 'A' ? 'your partner' : 'yourself'} to share more in conversations`

      case 'length_balance':
        return 'Try matching your partner\'s message length to create better flow'

      case 'reply_latency_score':
        return 'Consider setting up quicker check-ins to reduce response delays'

      case 'engagement_questions':
        return 'Ask more open-ended questions to deepen your conversations'

      case 'emoji_intimacy':
        return 'Add more heart emojis and affectionate expressions'

      case 'temporal_momentum':
        return 'Try to maintain regular communication to keep momentum growing'

      case 'photos_share':
        return 'Share more photos and visual moments together'

      case 'style_match':
        return 'Mirror your partner\'s communication style for better connection'

      default:
        return null
    }
  }

  private getGeneralSuggestion(features: ConversationFeatures): string {
    const score = this.calculateLocalScore(features)

    if (score >= 80) {
      return 'Keep up the great communication patterns you\'ve established'
    } else if (score >= 60) {
      return 'Plan a low-pressure moment together to strengthen your connection'
    } else {
      return 'Focus on small daily check-ins to rebuild communication momentum'
    }
  }

  private applyToxicityCap(score: number, toxicityHits: number): number {
    if (toxicityHits > 3) {
      return Math.min(score, 60) // Cap at 60 for high toxicity
    } else if (toxicityHits > 1) {
      return Math.min(score, 75) // Soft cap for moderate toxicity
    }
    return score
  }

  // Method to blend with LLM score if available
  blendWithLLM(result: AnalysisResult, llmResponse: any): AnalysisResult {
    // 60% local, 40% LLM weighting
    const blendedScore = Math.round(result.localScore * 0.6 + llmResponse.score * 0.4)

    return {
      ...result,
      llmScore: llmResponse.score,
      finalScore: blendedScore,
      explanation: llmResponse.explanation, // Use LLM explanation if available
      suggestions: llmResponse.suggestions, // Use LLM suggestions if available
      effort_balance: llmResponse.effort_balance,
      initiator: llmResponse.initiator,
      trend: llmResponse.trend,
      balance_meter: llmResponse.balance_meter
    }
  }
}