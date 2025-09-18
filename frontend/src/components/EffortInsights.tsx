import { AnalysisResult } from '../shared/types'
import { TrendingUp, TrendingDown, Users, MessageCircle, BarChart3 } from 'lucide-react'

interface EffortInsightsProps {
  result: AnalysisResult
}

export function EffortInsights({ result }: EffortInsightsProps) {
  if (!result.effort_balance && !result.initiator && !result.trend) {
    return null // Don't show if no AI insights available
  }

  const getBalanceMeterColor = (score?: number) => {
    if (!score) return 'bg-gray-300'
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getBalanceMeterLabel = (score?: number) => {
    if (!score) return 'Unknown'
    if (score >= 80) return 'Well Balanced'
    if (score >= 60) return 'Mostly Balanced'
    return 'Needs Balance'
  }

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null

    if (trend.toLowerCase().includes('increasing')) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    }
    if (trend.toLowerCase().includes('declining')) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    }
    return <BarChart3 className="w-4 h-4 text-blue-600" />
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-semibold">Effort & Balance Insights</h3>
      </div>

      <div className="space-y-6">
        {/* Effort Balance Statement */}
        {result.effort_balance && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Effort Balance</h4>
                <p className="text-blue-800">{result.effort_balance}</p>
              </div>
            </div>
          </div>
        )}

        {/* Balance Meter */}
        {result.balance_meter !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Balance Score</span>
              <span className="text-sm text-gray-600">
                {result.balance_meter}/100 - {getBalanceMeterLabel(result.balance_meter)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getBalanceMeterColor(result.balance_meter)}`}
                style={{ width: `${result.balance_meter}%` }}
              />
            </div>
          </div>
        )}

        {/* Initiator Pattern */}
        {result.initiator && (
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Conversation Starter</h4>
              <p className="text-gray-700">{result.initiator}</p>
            </div>
          </div>
        )}

        {/* Effort Trend */}
        {result.trend && (
          <div className="flex items-start gap-3">
            {getTrendIcon(result.trend)}
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Effort Trend</h4>
              <p className="text-gray-700">{result.trend}</p>
            </div>
          </div>
        )}
      </div>

      {/* Insight Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
          <p>
            <strong>Personal Insights:</strong> These insights use "You" and "Your partner"
            to help you understand relationship dynamics from your perspective.
            Balance scores above 70 indicate healthy mutual effort.
          </p>
        </div>
      </div>
    </div>
  )
}