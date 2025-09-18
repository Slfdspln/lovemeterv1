import { AnalysisResult } from '../shared/types'
import { Heart, Users, MessageSquare, Lightbulb } from 'lucide-react'

interface EffortInsightsProps {
  result: AnalysisResult
}

export function EffortInsights({ result }: EffortInsightsProps) {
  if (!result.who_loves_more && !result.scores && !result.top_evidence) {
    return null // Don't show if no AI insights available
  }

  const getWhoLoveMoreEmoji = (whoLovesMore?: string) => {
    switch (whoLovesMore) {
      case 'A': return '💖 You'
      case 'B': return '💙 Your Partner'
      case 'Balanced': return '💛 Both Equally'
      case 'Unclear': return '🤔 Unclear'
      default: return '❓ Unknown'
    }
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-300'
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getConfidenceLabel = (confidence?: number) => {
    if (!confidence) return 'Unknown'
    if (confidence >= 80) return 'High Confidence'
    if (confidence >= 60) return 'Medium Confidence'
    return 'Low Confidence'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-pink-600" />
        <h3 className="text-xl font-semibold">Relationship Balance Analysis</h3>
      </div>

      <div className="space-y-6">
        {/* Who Loves More */}
        {result.who_loves_more && (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-pink-900 mb-1">Who Shows More Love</h4>
                <p className="text-pink-800 text-lg font-semibold">
                  {getWhoLoveMoreEmoji(result.who_loves_more)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Individual Scores */}
        {result.scores && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-blue-900 mb-2">You (A)</h4>
              <div className="text-2xl font-bold text-blue-800">{result.scores.A}/100</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <h4 className="font-medium text-purple-900 mb-2">Your Partner (B)</h4>
              <div className="text-2xl font-bold text-purple-800">{result.scores.B}/100</div>
            </div>
          </div>
        )}

        {/* Confidence Level */}
        {result.confidence !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Analysis Confidence</span>
              <span className="text-sm text-gray-600">
                {result.confidence}/100 - {getConfidenceLabel(result.confidence)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getConfidenceColor(result.confidence)}`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        )}

        {/* Top Evidence */}
        {result.top_evidence && result.top_evidence.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Key Evidence
            </h4>
            <div className="space-y-3">
              {result.top_evidence.map((evidence, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                      {evidence.speaker === 'A' ? 'You' : 'Partner'} • {evidence.source}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 italic">"{evidence.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Insight Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p>
            <strong>AI Analysis:</strong> This analysis considers all forms of positive expression
            including compliments, care, vulnerability, initiative, and consistency.
            Balance is measured by comparing emotional investment from both partners.
          </p>
        </div>
      </div>
    </div>
  )
}