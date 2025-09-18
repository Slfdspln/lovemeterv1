import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, FileText, AlertCircle, ArrowLeft, Heart } from 'lucide-react'
import { AnalysisResult, UploadProgress, RedactionOptions } from '@love-meter/shared'
import { ProcessingEngine } from '../lib/processing'
import { Button } from './ui/Button'
import { Progress } from './ui/Progress'
import { PrivacyControls } from './PrivacyControls'

interface UploadScreenProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  onBackToLanding?: () => void
}

export function UploadScreen({ onAnalysisComplete, onBackToLanding }: UploadScreenProps) {
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string>('')
  const [mode, setMode] = useState<'screenshots' | 'text'>('screenshots')
  const [analysisMode, setAnalysisMode] = useState<'local' | 'hybrid' | 'cloud'>('local')
  const [redactionOptions, setRedactionOptions] = useState<RedactionOptions>({
    redactEmails: true,
    redactPhones: true,
    redactAddresses: true,
    redactUrls: true,
    redactAmounts: true,
  })
  const [consentGiven, setConsentGiven] = useState(false)
  const [showPrivacyControls, setShowPrivacyControls] = useState(false)

  const processingEngine = new ProcessingEngine()

  const processFiles = async (files: File[]) => {
    // Check consent for AI modes
    if ((analysisMode === 'hybrid' || analysisMode === 'cloud') && !consentGiven) {
      setError('Please review privacy settings and give consent for AI analysis.')
      setShowPrivacyControls(true)
      return
    }

    try {
      setError('')
      setProgress({ stage: 'uploading', progress: 0 })

      // Configure processing engine
      processingEngine.setMode(analysisMode)
      processingEngine.setRedactionOptions(redactionOptions)

      const result = await processingEngine.processScreenshots(files, setProgress)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      setProgress(null)
    }
  }

  const processText = async (text: string) => {
    if ((analysisMode === 'hybrid' || analysisMode === 'cloud') && !consentGiven) {
      setError('Please review privacy settings and give consent for AI analysis.')
      setShowPrivacyControls(true)
      return
    }

    try {
      setError('')
      setProgress({ stage: 'parsing', progress: 0 })

      processingEngine.setMode(analysisMode)
      processingEngine.setRedactionOptions(redactionOptions)

      const result = await processingEngine.processText(text, setProgress)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed')
      setProgress(null)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file =>
      file.type.startsWith('image/')
    )

    if (imageFiles.length === 0) {
      setError('Please upload image files (PNG, JPG, etc.)')
      return
    }

    processFiles(imageFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    disabled: !!progress
  })

  const stageMessages = {
    uploading: 'Uploading screenshots...',
    ocr: 'Reading text from images...',
    parsing: 'Parsing conversation...',
    analyzing: 'Computing relationship features...',
    complete: 'Analysis complete!'
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      {onBackToLanding && (
        <div className="flex justify-start mb-6">
          <Button
            onClick={onBackToLanding}
            variant="outline"
            className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border-purple-300 text-purple-700 hover:text-purple-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <Heart className="w-4 h-4 mr-2 fill-current text-pink-500" />
            Back to Michales
          </Button>
        </div>
      )}

      {/* Mode Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <button
            onClick={() => setMode('screenshots')}
            className={`px-6 py-2 rounded-md transition-colors ${
              mode === 'screenshots'
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Image className="w-4 h-4 inline mr-2" />
            Screenshots
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-6 py-2 rounded-md transition-colors ${
              mode === 'text'
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Paste Text
          </button>
        </div>
      </div>

      {mode === 'screenshots' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Upload Area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-gray-400'
            } ${progress ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Drop your screenshots or click to upload
            </h3>
            <p className="text-gray-600 mb-4">
              Support PNG, JPG, WEBP files. Multiple files allowed.
            </p>
            <Button disabled={!!progress}>
              Choose Files
            </Button>
          </div>

          {/* Progress */}
          {progress && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {stageMessages[progress.stage]}
                </span>
                <span className="text-sm text-gray-600">
                  {progress.progress}%
                </span>
              </div>
              <Progress value={progress.progress} className="w-full" />
              {progress.message && (
                <p className="text-sm text-gray-600 mt-2">{progress.message}</p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Help */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">How to export from iPhone:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Option 1: Take screenshots of your conversation</li>
              <li>• Option 2: Mac Messages → Cmd+A → Copy → Paste here (text mode)</li>
              <li>• Option 3: Export with third-party tools (iMazing, etc.)</li>
            </ul>
          </div>
        </div>
      )}

      {mode === 'text' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <textarea
            id="text-input"
            placeholder="Paste your conversation text here..."
            className="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={!!progress}
          />
          <div className="flex justify-end mt-4">
            <Button
              disabled={!!progress}
              onClick={() => {
                const textArea = document.getElementById('text-input') as HTMLTextAreaElement
                if (textArea?.value.trim()) {
                  processText(textArea.value)
                } else {
                  setError('Please paste some conversation text first.')
                }
              }}
            >
              Analyze Text
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Controls */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Privacy & Analysis Settings</h3>
          <Button
            variant="outline"
            onClick={() => setShowPrivacyControls(!showPrivacyControls)}
          >
            {showPrivacyControls ? 'Hide' : 'Show'} Settings
          </Button>
        </div>

        {showPrivacyControls && (
          <PrivacyControls
            options={redactionOptions}
            onOptionsChange={setRedactionOptions}
            onModeChange={setAnalysisMode}
            selectedMode={analysisMode}
            consentGiven={consentGiven}
            onConsentChange={setConsentGiven}
          />
        )}

        {!showPrivacyControls && (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              <strong>Current mode:</strong> {analysisMode === 'local' ? 'Local (100% private)' :
                analysisMode === 'hybrid' ? 'Hybrid (AI enhanced)' : 'Cloud processing'}
              {(analysisMode === 'hybrid' || analysisMode === 'cloud') && !consentGiven && (
                <span className="text-red-600 ml-2">⚠️ Consent required</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}