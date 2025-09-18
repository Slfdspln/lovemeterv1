import { useState } from 'react'
import { RedactionOptions } from '@love-meter/shared'
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface PrivacyControlsProps {
  options: RedactionOptions
  onOptionsChange: (options: RedactionOptions) => void
  onModeChange: (mode: 'local' | 'hybrid' | 'cloud') => void
  selectedMode: 'local' | 'hybrid' | 'cloud'
  consentGiven: boolean
  onConsentChange: (consent: boolean) => void
}

export function PrivacyControls({
  options,
  onOptionsChange,
  onModeChange,
  selectedMode,
  consentGiven,
  onConsentChange
}: PrivacyControlsProps) {
  const [showPreview, setShowPreview] = useState(false)

  const updateOption = (key: keyof RedactionOptions, value: boolean) => {
    onOptionsChange({ ...options, [key]: value })
  }

  const sampleText = "Hey! My email is john@example.com and my phone is 555-123-4567. Can you meet me at 123 Main Street? I'll send you $25 for coffee. Check out this cool site: https://example.com"

  const getRedactedPreview = () => {
    let text = sampleText
    if (options.redactEmails) text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
    if (options.redactPhones) text = text.replace(/\d{3}-\d{3}-\d{4}/g, '[PHONE]')
    if (options.redactAddresses) text = text.replace(/\d+\s+[A-Za-z\s]+Street/g, '[ADDRESS]')
    if (options.redactAmounts) text = text.replace(/\$\d+/g, '[AMOUNT]')
    if (options.redactUrls) text = text.replace(/https?:\/\/[^\s]+/g, '[URL]')
    return text
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-green-600" />
        <h3 className="text-xl font-semibold">Privacy & Analysis Mode</h3>
      </div>

      {/* Analysis Mode Selection */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Choose Analysis Mode</h4>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="mode"
              value="local"
              checked={selectedMode === 'local'}
              onChange={(e) => onModeChange(e.target.value as 'local')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Local Analysis (Recommended)</div>
              <div className="text-sm text-gray-600">
                100% private processing on your device. Fast heuristic analysis with good accuracy.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="mode"
              value="hybrid"
              checked={selectedMode === 'hybrid'}
              onChange={(e) => onModeChange(e.target.value as 'hybrid')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Hybrid Analysis (Best Insights)</div>
              <div className="text-sm text-gray-600">
                Local processing + AI enhancement. Only redacted snippets sent to OpenAI.
              </div>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="mode"
              value="cloud"
              checked={selectedMode === 'cloud'}
              onChange={(e) => onModeChange(e.target.value as 'cloud')}
              className="mt-1"
            />
            <div>
              <div className="font-medium">Cloud Analysis</div>
              <div className="text-sm text-gray-600">
                Server processing for maximum accuracy. Data handled according to privacy policy.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Redaction Options */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Data Redaction Settings</h4>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>Email addresses</span>
            <input
              type="checkbox"
              checked={options.redactEmails}
              onChange={(e) => updateOption('redactEmails', e.target.checked)}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Phone numbers</span>
            <input
              type="checkbox"
              checked={options.redactPhones}
              onChange={(e) => updateOption('redactPhones', e.target.checked)}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Addresses</span>
            <input
              type="checkbox"
              checked={options.redactAddresses}
              onChange={(e) => updateOption('redactAddresses', e.target.checked)}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>URLs and links</span>
            <input
              type="checkbox"
              checked={options.redactUrls}
              onChange={(e) => updateOption('redactUrls', e.target.checked)}
              className="rounded"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Money amounts</span>
            <input
              type="checkbox"
              checked={options.redactAmounts}
              onChange={(e) => updateOption('redactAmounts', e.target.checked)}
              className="rounded"
            />
          </label>
        </div>

        {/* Preview Toggle */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPreview ? 'Hide' : 'Show'} redaction preview
        </button>

        {showPreview && (
          <div className="mt-3 p-3 bg-gray-50 rounded border text-sm">
            <div className="mb-2 text-gray-600">Original:</div>
            <div className="mb-3 font-mono text-xs bg-white p-2 rounded border">
              {sampleText}
            </div>
            <div className="mb-2 text-gray-600">After redaction:</div>
            <div className="font-mono text-xs bg-white p-2 rounded border">
              {getRedactedPreview()}
            </div>
          </div>
        )}
      </div>

      {/* Consent */}
      {(selectedMode === 'hybrid' || selectedMode === 'cloud') && (
        <div className="mb-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800 mb-2">AI Enhancement Notice</div>
              <div className="text-sm text-yellow-700 mb-3">
                {selectedMode === 'hybrid'
                  ? 'Only redacted snippets and numeric features will be sent to OpenAI for analysis enhancement.'
                  : 'Your conversation data will be processed on our servers with industry-standard security.'
                }
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => onConsentChange(e.target.checked)}
                  className="mt-1 rounded"
                />
                <span className="text-sm text-yellow-800">
                  I have consent from both participants or the right to analyze this conversation,
                  and I agree to the selected processing mode.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h5 className="font-medium text-green-800 mb-2">Your Privacy is Protected</h5>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• All OCR and initial processing happens on your device</li>
          <li>• Sensitive data is redacted before any analysis</li>
          <li>• No raw conversation data is stored on our servers</li>
          <li>• You can delete all analysis data immediately after viewing</li>
          {selectedMode === 'local' && <li>• Nothing leaves your device in local mode</li>}
        </ul>
      </div>
    </div>
  )
}