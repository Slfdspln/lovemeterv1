import { useState } from 'react'
import { AnalysisResult } from '@love-meter/shared'
import { Button } from './ui/Button'
import { ScoreMeter } from './ScoreMeter'
import { FeatureBreakdown } from './FeatureBreakdown'
import { ConversationStats } from './ConversationStats'
import { Suggestions } from './Suggestions'
import { ShareCard } from './ShareCard'
import PhotosSection from './PhotosSection'
import { EffortInsights } from './EffortInsights'
import { RotateCcw, Share, Download, Trash2, Heart } from 'lucide-react'

interface ResultsScreenProps {
  result: AnalysisResult
  onNewAnalysis: () => void
  onForYou?: () => void
}

export function ResultsScreen({ result, onNewAnalysis, onForYou }: ResultsScreenProps) {
  const [showShare, setShowShare] = useState(false)

  const handleDelete = () => {
    if (confirm('Delete this analysis? This action cannot be undone.')) {
      onNewAnalysis()
    }
  }

  const handleExport = () => {
    const exportData = {
      score: result.finalScore,
      explanation: result.explanation,
      suggestions: result.suggestions,
      features: result.features,
      timestamp: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `love-meter-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Your Relationship Analysis</h2>
        <p className="text-gray-600">
          Based on {result.features.msg_count_A + result.features.msg_count_B} messages
          over the last {result.features.window_days} days
        </p>
      </div>

      {/* Score Meter */}
      <ScoreMeter
        score={result.finalScore}
        explanation={result.explanation}
        llmScore={result.llmScore}
      />

      {/* Feature Breakdown */}
      <FeatureBreakdown contributions={result.contributions} />

      {/* Effort Insights (only shown if AI analysis available) */}
      <EffortInsights result={result} />

      {/* Stats, Photos, and Suggestions */}
      <div className="grid md:grid-cols-3 gap-8">
        <ConversationStats features={result.features} />
        <PhotosSection score={result.finalScore} />
        <Suggestions suggestions={result.suggestions} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={onNewAnalysis} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          New Analysis
        </Button>

        {onForYou && (
          <Button
            onClick={onForYou}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <Heart className="w-4 h-4 mr-2 fill-current" />
            For You
          </Button>
        )}

        <Button onClick={() => setShowShare(true)} variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Share Results
        </Button>

        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>

        <Button onClick={handleDelete} variant="outline">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Analysis
        </Button>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareCard
          result={result}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}