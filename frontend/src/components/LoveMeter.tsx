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
    return { leader: 'Time to reconnect', message: '💙 Could use some more love vibes between you two!' }
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
          <div className="relative w-80 h-52 flex flex-col items-center justify-center">
            {/* Gauge Container */}
            <div className="relative">
              <svg width="240" height="140" viewBox="0 0 240 140" className="overflow-visible">
                {/* Background arc */}
                <path
                  d="M 40 120 A 80 80 0 0 1 200 120"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Progress arc */}
                <path
                  d="M 40 120 A 80 80 0 0 1 200 120"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (animatedScore / 100) * 251.2}
                  className="transition-all duration-2000 ease-out"
                />
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Hearts positioned around the arc */}
              {[20, 50, 80, 110, 140, 170].map((heartAngle, i) => {
                const radian = (heartAngle * Math.PI) / 180
                const radius = 95
                const x = 120 + Math.cos(radian) * radius
                const y = 120 - Math.sin(radian) * radius

                return (
                  <div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span
                      className={`text-lg transition-all duration-1000 ${
                        heartAngle <= ((animatedScore / 100) * 160) + 20 ? 'text-red-500 scale-110' : 'text-gray-300 scale-90'
                      }`}
                    >
                      💖
                    </span>
                  </div>
                )
              })}

              {/* Needle */}
              <div
                className="absolute pointer-events-none"
                style={{ left: '120px', top: '120px', transform: 'translate(-50%, -50%)' }}
              >
                <div
                  className="w-1 h-20 bg-gray-800 rounded-full origin-bottom transition-transform duration-2000 ease-out shadow-lg"
                  style={{
                    transform: `rotate(${(animatedScore / 100) * 160 - 80}deg)`,
                    transformOrigin: '50% 100%'
                  }}
                ></div>
                <div className="w-4 h-4 bg-gray-800 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
              </div>
            </div>

            {/* Score display */}
            <div className="text-center mt-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {Math.round(animatedScore)}%
              </div>
              <div className="text-xl font-semibold text-pink-600">
                {result.leader}
              </div>
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