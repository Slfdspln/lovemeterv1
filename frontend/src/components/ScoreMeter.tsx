interface ScoreMeterProps {
  score: number
  explanation: string
  llmScore?: number
}

export function ScoreMeter({ score, explanation, llmScore }: ScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'from-green-400 to-green-600'
    if (score >= 70) return 'from-blue-400 to-blue-600'
    if (score >= 50) return 'from-yellow-400 to-yellow-600'
    return 'from-red-400 to-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Healthy'
    if (score >= 50) return 'Neutral'
    return 'Needs Work'
  }

  const circumference = 2 * Math.PI * 90 // radius = 90
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Score Circle */}
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`stop-color-current ${getScoreBackground(score).split(' ')[0].replace('from-', 'text-')}`} />
                <stop offset="100%" className={`stop-color-current ${getScoreBackground(score).split(' ')[1].replace('to-', 'text-')}`} />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-gray-600 text-sm">out of 100</div>
            <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex-1 text-center lg:text-left">
          <h3 className="text-xl font-semibold mb-4">Analysis Summary</h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            {explanation}
          </p>

          {llmScore && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span>Local analysis: {Math.round((score - llmScore * 0.4) / 0.6)}</span>
                <span>AI enhancement: {llmScore}</span>
                <span className="font-medium">Final: {score}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}