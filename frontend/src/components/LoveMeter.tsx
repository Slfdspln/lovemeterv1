import { useEffect, useState } from 'react'

interface LoveMeterProps {
  score: number
  explanation: string
  llmScore?: number
}

export function LoveMeter({ score, explanation, llmScore }: LoveMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  // Convert 0-100 score to angle (0-180 degrees for half circle)
  const angle = (animatedScore / 100) * 180

  const getLoveLeader = (score: number) => {
    if (score >= 85) return { leader: 'You', message: '🔥 You\'re totally winning this love game!' }
    if (score >= 70) return { leader: 'Balanced', message: '💕 Perfect balance - you\'re both equally smitten!' }
    if (score >= 50) return { leader: 'They\'re leading', message: '😍 They might love you just a tiny bit more!' }
    return { leader: 'They\'re winning', message: '🥰 They\'re completely obsessed with you!' }
  }

  const getMeterColor = (score: number) => {
    if (score >= 85) return 'from-red-400 to-red-600' // Hot red for high love
    if (score >= 70) return 'from-pink-400 to-red-500' // Pink to red
    if (score >= 50) return 'from-yellow-400 to-pink-500' // Yellow to pink
    return 'from-yellow-300 to-orange-400' // Cool yellow/orange
  }

  const result = getLoveLeader(score)

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">💖 Love Leader</h3>
        <p className="text-gray-600">Who's more obsessed?</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Love Meter Gauge */}
        <div className="relative flex flex-col items-center">
          {/* Hearts around the gauge */}
          <div className="relative w-64 h-32">
            {/* Hearts positioned around semicircle */}
            {[0, 30, 60, 90, 120, 150, 180].map((heartAngle, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  transform: `rotate(${heartAngle}deg) translateY(-120px) rotate(-${heartAngle}deg)`,
                  transformOrigin: '0 120px',
                  left: '50%',
                  top: '100%'
                }}
              >
                <span
                  className={`text-lg transition-all duration-1000 ${
                    heartAngle <= angle ? 'text-red-500 scale-125' : 'text-gray-300 scale-100'
                  }`}
                >
                  ❤️
                </span>
              </div>
            ))}

            {/* Gauge background */}
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-48 h-24 overflow-hidden">
                <div className="w-48 h-48 rounded-full border-8 border-gray-200"></div>
              </div>
            </div>

            {/* Animated gauge fill */}
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="w-48 h-24 overflow-hidden">
                <div
                  className={`w-48 h-48 rounded-full border-8 bg-gradient-to-r ${getMeterColor(score)} transition-all duration-2000 ease-out`}
                  style={{
                    clipPath: `polygon(0 100%, 50% 50%, ${50 + (angle / 180) * 50}% ${50 - Math.sin((angle * Math.PI) / 180) * 50}%, 100% 100%)`
                  }}
                ></div>
              </div>
            </div>

            {/* Needle */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
              <div
                className="w-1 h-20 bg-gray-800 rounded-full origin-bottom transition-transform duration-2000 ease-out"
                style={{ transform: `rotate(${angle - 90}deg)` }}
              ></div>
              <div className="w-4 h-4 bg-gray-800 rounded-full absolute -bottom-2 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>

          {/* Score display */}
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {Math.round(animatedScore)}%
            </div>
            <div className="text-lg font-semibold text-pink-600">
              {result.leader}
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="flex-1 text-center lg:text-left">
          <div className="bg-pink-50 rounded-lg p-6 mb-4">
            <div className="text-2xl mb-2">{result.message}</div>
          </div>

          <div className="text-gray-700 leading-relaxed mb-4">
            {explanation}
          </div>

          {llmScore && (
            <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span>📊 Local analysis: {Math.round((score - llmScore * 0.4) / 0.6)}%</span>
                <span>🤖 AI boost: {llmScore}%</span>
                <span className="font-medium">💖 Final: {score}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}