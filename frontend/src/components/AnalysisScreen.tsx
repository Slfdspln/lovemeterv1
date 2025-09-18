import { Loader2 } from 'lucide-react'

export function AnalysisScreen() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-xl shadow-lg p-12">
        <Loader2 className="w-12 h-12 mx-auto mb-6 text-primary animate-spin" />
        <h2 className="text-2xl font-semibold mb-4">
          Analyzing Your Conversation
        </h2>
        <p className="text-gray-600">
          Computing relationship insights and generating personalized suggestions...
        </p>
      </div>
    </div>
  )
}