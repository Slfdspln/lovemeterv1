import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { UploadScreen } from './components/UploadScreen'
import { AnalysisScreen } from './components/AnalysisScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { ForYouPage } from './components/ForYouPage'
import { AnalysisResult } from '@love-meter/shared'

type AppState = 'landing' | 'upload' | 'analyzing' | 'results' | 'foryou'

function App() {
  const [state, setState] = useState<AppState>('landing')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const handleUploadComplete = (result: AnalysisResult) => {
    setAnalysisResult(result)
    setState('results')
  }

  const handleNewAnalysis = () => {
    setState('upload')
    setAnalysisResult(null)
  }

  const handleForYou = () => {
    setState('foryou')
  }

  const handleBackFromForYou = () => {
    setState('results')
  }

  const handleStartAnalysis = () => {
    setState('upload')
  }

  const handleForYouFromLanding = () => {
    setState('foryou')
  }

  return (
    <>
      {state === 'landing' && (
        <LandingPage
          onStartAnalysis={handleStartAnalysis}
          onForYou={handleForYouFromLanding}
        />
      )}

      {(state === 'upload' || state === 'analyzing' || state === 'results') && (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
          <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Love Meter v2
              </h1>
              <p className="text-gray-600 mt-2">
                Analyze your relationship conversations with privacy and insights
              </p>
            </header>

            {state === 'upload' && (
              <UploadScreen onAnalysisComplete={handleUploadComplete} />
            )}

            {state === 'analyzing' && (
              <AnalysisScreen />
            )}

            {state === 'results' && analysisResult && (
              <ResultsScreen
                result={analysisResult}
                onNewAnalysis={handleNewAnalysis}
                onForYou={handleForYou}
              />
            )}
          </div>
        </div>
      )}

      {state === 'foryou' && (
        <ForYouPage onBack={handleBackFromForYou} />
      )}
    </>
  )
}

export default App