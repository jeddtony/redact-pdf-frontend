import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import WordSelector from '../components/WordSelector'
import PDFPreview from '../components/PDFPreview'
import SharePanel from '../components/SharePanel'
import { uploadPdf, redactPdf, getPreview, detectSensitiveWords } from '../api/client'

type Stage = 'upload' | 'select' | 'preview' | 'share'

export default function Home() {
  const [stage, setStage] = useState<Stage>('upload')
  const [uploading, setUploading] = useState(false)
  const [redacting, setRedacting] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [docId, setDocId] = useState<string | null>(null)
  const [wordFreqs, setWordFreqs] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [suggested, setSuggested] = useState<Set<string>>(new Set())
  const [previewPages, setPreviewPages] = useState<string[]>([])
  const [redactedPages, setRedactedPages] = useState<string[]>([])

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const res = await uploadPdf(file)
      setDocId(res.doc_id)
      setWordFreqs(res.word_frequencies)

      const preview = await getPreview(res.doc_id, false)
      setPreviewPages(preview.pages)
      setStage('select')
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleToggle(word: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  async function handleAutoDetect() {
    if (!docId) return
    setError(null)
    setDetecting(true)
    try {
      const res = await detectSensitiveWords(docId)
      const wordSet = new Set(res.suggested_words)
      setSuggested(wordSet)
      // Auto-select all suggested words that exist in the word list
      setSelected((prev) => {
        const next = new Set(prev)
        for (const w of wordSet) {
          if (wordFreqs[w] !== undefined) next.add(w)
        }
        return next
      })
    } catch {
      setError('Auto-detection failed. Please try again or select words manually.')
    } finally {
      setDetecting(false)
    }
  }

  async function handleRedact() {
    if (!docId || selected.size === 0) return
    setError(null)
    setRedacting(true)
    try {
      await redactPdf(docId, Array.from(selected))
      const preview = await getPreview(docId, true)
      setRedactedPages(preview.pages)
      setStage('preview')
    } catch {
      setError('Redaction failed. Please try again.')
    } finally {
      setRedacting(false)
    }
  }

  function handleReset() {
    setStage('upload')
    setDocId(null)
    setWordFreqs({})
    setSelected(new Set())
    setSuggested(new Set())
    setPreviewPages([])
    setRedactedPages([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">RedactFlow</span>
          <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">beta</span>
        </div>
        {stage !== 'upload' && (
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Start over
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {stage === 'upload' && (
          <div className="max-w-xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Redact your PDF</h1>
              <p className="text-gray-500">Upload a PDF, choose words to remove, and share the result.</p>
            </div>
            <FileUpload onFile={handleFile} loading={uploading} />
          </div>
        )}

        {stage === 'select' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select words to redact</h2>
              <WordSelector
                wordFrequencies={wordFreqs}
                selected={selected}
                suggested={suggested}
                onToggle={handleToggle}
                onConfirm={handleRedact}
                onAutoDetect={handleAutoDetect}
                redacting={redacting}
                detecting={detecting}
              />
            </div>
            <div>
              <PDFPreview pages={previewPages} label="Original preview" />
            </div>
          </div>
        )}

        {(stage === 'preview' || stage === 'share') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Redaction complete</h2>
                <p className="text-sm text-gray-500">
                  {selected.size} word{selected.size !== 1 ? 's' : ''} permanently removed.
                </p>
              </div>
              {docId && (
                <>
                  {stage === 'preview' && (
                    <button
                      onClick={() => setStage('share')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 transition-colors"
                    >
                      Share redacted PDF
                    </button>
                  )}
                  {stage === 'share' && <SharePanel docId={docId} />}
                </>
              )}
            </div>
            <div>
              <PDFPreview pages={redactedPages} label="Redacted preview" />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
