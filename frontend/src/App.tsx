import { useState } from 'react'
import { LandingPage } from './components/LandingPage'
import { UploadScreen } from './components/UploadScreen'
import { AnalysisScreen } from './components/AnalysisScreen'
import { ResultsScreen } from './components/ResultsScreen'
import { ForYouPage } from './components/ForYouPage'
import { ShaderAnimation } from './components/ui/neno-shader'
import { AnalysisResult } from './shared/types'

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
    setState('landing')
  }

  const handleStartAnalysis = () => {
    setState('upload')
  }

  const handleForYouFromLanding = () => {
    setState('foryou')
  }

  const handleBackToLanding = () => {
    setState('landing')
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
        <div className="min-h-screen relative overflow-hidden">
          {/* Neon Shader Background */}
          <div className="fixed inset-0 -z-10">
            <ShaderAnimation />
          </div>

          <div className="container mx-auto px-4 py-8 relative z-10">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                Love Meter
              </h1>
            </header>

            {state === 'upload' && (
              <UploadScreen
                onAnalysisComplete={handleUploadComplete}
                onBackToLanding={handleBackToLanding}
              />
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