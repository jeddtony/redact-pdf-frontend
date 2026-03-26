import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PDFPreview from '../components/PDFPreview'
import { getShared } from '../api/client'

export default function SharedView() {
  const { shareId } = useParams<{ shareId: string }>()
  const [pages, setPages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shareId) return
    getShared(shareId)
      .then((res) => setPages(res.pages))
      .catch(() => setError('This link has expired or the document was not found.'))
      .finally(() => setLoading(false))
  }, [shareId])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <span className="text-xl font-bold text-gray-900">RedactFlow</span>
        <span className="ml-2 text-xs text-gray-400">shared document</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Loading document…
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <h1 className="text-xl font-semibold text-gray-800 mb-6">Redacted document</h1>
            <PDFPreview pages={pages} />
          </>
        )}
      </main>
    </div>
  )
}
