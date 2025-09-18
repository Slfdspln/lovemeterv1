import { useState } from 'react'
import { AnalysisResult } from '@love-meter/shared'
import { Button } from './ui/Button'
import { X, Download, Share2 } from 'lucide-react'

interface ShareCardProps {
  result: AnalysisResult
  onClose: () => void
}

export function ShareCard({ result, onClose }: ShareCardProps) {
  const [anonymized, setAnonymized] = useState(true)

  const generateShareText = () => {
    const score = result.finalScore
    const emoji = score >= 85 ? '💖' : score >= 70 ? '💙' : score >= 50 ? '💛' : '🧡'

    return `Love Meter Analysis ${emoji}

Score: ${score}/100
${result.explanation}

Top insights:
${result.contributions.slice(0, 2).map(c =>
  `${c.contribution > 0 ? '✨' : '💡'} ${c.label}${c.contribution > 0 ? ` (+${c.contribution})` : ` (${c.contribution})`}`
).join('\n')}

Generated with Love Meter v2 ✨`
  }

  const downloadShareImage = () => {
    // Create a canvas to generate the share image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    canvas.width = 600
    canvas.height = 400

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#f8fafc')
    gradient.addColorStop(1, '#e2e8f0')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add content
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 32px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Love Meter v2', canvas.width / 2, 80)

    // Score circle
    const centerX = canvas.width / 2
    const centerY = 200
    const radius = 60

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 8
    ctx.stroke()

    // Score arc
    const scoreAngle = (result.finalScore / 100) * 2 * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + scoreAngle)
    ctx.strokeStyle = result.finalScore >= 70 ? '#10b981' : result.finalScore >= 50 ? '#f59e0b' : '#ef4444'
    ctx.lineWidth = 8
    ctx.stroke()

    // Score text
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 36px system-ui'
    ctx.fillText(result.finalScore.toString(), centerX, centerY + 12)

    // Footer
    ctx.font = '16px system-ui'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Relationship insights powered by AI', centerX, 350)

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `love-meter-${result.finalScore}.png`
        a.click()
        URL.revokeObjectURL(url)
      }
    })
  }

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Love Meter Analysis',
          text: generateShareText(),
          url: window.location.href
        })
      } catch (err) {
        // User cancelled or share failed
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(generateShareText())
      alert('Share text copied to clipboard!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Share Your Results</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Privacy-First Sharing</h4>
            <p className="text-blue-800 text-sm">
              Share cards include only your score and general insights.
              No raw conversation data is included.
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 mb-6 text-center">
            <div className="text-3xl mb-2">
              {result.finalScore >= 85 ? '💖' :
               result.finalScore >= 70 ? '💙' :
               result.finalScore >= 50 ? '💛' : '🧡'}
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {result.finalScore}/100
            </div>
            <div className="text-sm text-gray-600 mb-4">
              {result.explanation}
            </div>
            <div className="text-xs text-gray-500">
              Generated with Love Meter v2 ✨
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={shareNatively}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Text Summary
            </Button>

            <Button
              onClick={downloadShareImage}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Share Image
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            Keep it classy ✨ Remember this is for fun and shouldn't replace
            real relationship communication.
          </p>
        </div>
      </div>
    </div>
  )
}