import { useState } from 'react'
import { Lightbulb, Copy, Check } from 'lucide-react'

interface SuggestionsProps {
  suggestions: string[]
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const generateActionableTemplate = (suggestion: string): string => {
    // Convert suggestions into actionable templates
    if (suggestion.includes('quick check-ins')) {
      return "Hey, can we try quick same-day check-ins? Even a short text works for me."
    }
    if (suggestion.includes('more positive words')) {
      return "I really appreciate how you [specific thing]. It makes me feel [positive emotion]."
    }
    if (suggestion.includes('questions')) {
      return "What was the best part of your day? I'd love to hear about it."
    }
    if (suggestion.includes('message length')) {
      return "I notice we have different texting styles - want to find a rhythm that works for both of us?"
    }
    if (suggestion.includes('emojis')) {
      return "Your messages always brighten my day ❤️ I should probably use more emojis too!"
    }
    return suggestion
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="text-xl font-semibold">Improvement Suggestions</h3>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-700 mb-2">{suggestion}</p>
                <details className="text-sm">
                  <summary className="text-primary cursor-pointer hover:text-primary/80">
                    Make it actionable
                  </summary>
                  <div className="mt-2 p-3 bg-blue-50 rounded border-l-4 border-blue-300">
                    <p className="text-blue-800 italic">
                      "{generateActionableTemplate(suggestion)}"
                    </p>
                    <button
                      onClick={() => handleCopy(generateActionableTemplate(suggestion), index)}
                      className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy template
                        </>
                      )}
                    </button>
                  </div>
                </details>
              </div>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <p>
          <strong>Pro tip:</strong> Start with just one suggestion that feels natural to you.
          Small changes in communication can lead to big improvements over time.
        </p>
      </div>
    </div>
  )
}