import { FeatureContribution } from '@love-meter/shared'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface FeatureBreakdownProps {
  contributions: FeatureContribution[]
}

export function FeatureBreakdown({ contributions }: FeatureBreakdownProps) {
  const topContributions = contributions.slice(0, 6) // Show top 6 factors

  const getContributionIcon = (contribution: number) => {
    if (contribution > 5) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (contribution < -5) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getContributionColor = (contribution: number) => {
    if (contribution > 5) return 'text-green-600 bg-green-50 border-green-200'
    if (contribution < -5) return 'text-red-600 bg-red-50 border-red-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const formatContribution = (contribution: number) => {
    if (contribution > 0) return `+${contribution}`
    return contribution.toString()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-6">What's Driving Your Score</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {topContributions.map((contrib, index) => (
          <div
            key={contrib.feature}
            className={`flex items-center justify-between p-4 rounded-lg border ${getContributionColor(contrib.contribution)}`}
          >
            <div className="flex items-center gap-3">
              {getContributionIcon(contrib.contribution)}
              <span className="font-medium">{contrib.label}</span>
            </div>
            <span className="text-lg font-bold">
              {formatContribution(contrib.contribution)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <p>
          <strong>How to read this:</strong> Positive numbers boost your score, negative numbers lower it.
          The bigger the number, the stronger the impact on your relationship analysis.
        </p>
      </div>
    </div>
  )
}