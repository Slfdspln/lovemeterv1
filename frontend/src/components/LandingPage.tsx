import { PhotoGallery } from './ui/gallery'
import { Component as AnimatedBackground } from './ui/raycast-animated-background'
import { ConnectSection } from './ConnectSection'
import { Heart } from 'lucide-react'

interface LandingPageProps {
  onStartAnalysis: () => void
  onForYou: () => void
}

export function LandingPage({ onStartAnalysis, onForYou }: LandingPageProps) {

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <AnimatedBackground />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 mt-16">
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-8 tracking-tight">
            Love Meter
          </h1>
        </header>

        {/* Connect Section */}
        <ConnectSection onStartAnalysis={onStartAnalysis} onForYou={onForYou} />

        {/* Photo Gallery with Matrix Text */}
        <PhotoGallery animationDelay={0.5} />


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