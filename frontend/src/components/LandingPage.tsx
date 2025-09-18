import { useState } from 'react'
import { PhotoGallery } from './ui/gallery'
import { Button } from './ui/Button'
import { Heart, ArrowRight } from 'lucide-react'

interface LandingPageProps {
  onStartAnalysis: () => void
  onForYou: () => void
}

export function LandingPage({ onStartAnalysis, onForYou }: LandingPageProps) {
  const [showGallery, setShowGallery] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Love Meter v2
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Analyze your relationship conversations with privacy and insights.
            Discover the beautiful dynamics of your connection.
          </p>
        </header>

        {/* Photo Gallery with Matrix Text */}
        <PhotoGallery animationDelay={0.5} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Button
            onClick={onStartAnalysis}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white px-8 py-3"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Love Analysis
          </Button>

          <Button
            onClick={onForYou}
            size="lg"
            className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white px-8 py-3"
          >
            <Heart className="w-5 h-5 mr-2 fill-current" />
            For You, Michales
          </Button>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">
              All analysis happens locally. Your conversations stay private and secure.
            </p>
          </div>

          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Enhanced</h3>
            <p className="text-gray-600 text-sm">
              Optional ChatGPT integration for deeper insights and personalized suggestions.
            </p>
          </div>

          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">📊</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Deep Analysis</h3>
            <p className="text-gray-600 text-sm">
              9 relationship metrics analyzed with explainable results and actionable insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}