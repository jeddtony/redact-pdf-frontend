import { useState } from 'react'
import { sharePdf } from '../api/client'

interface Props {
  docId: string
}

export default function SharePanel({ docId }: Props) {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleShare() {
    setLoading(true)
    setError(null)
    try {
      const res = await sharePdf(docId)
      setShareUrl(res.share_url)
      setShareId(res.share_id)
    } catch (e: unknown) {
      setError('Failed to generate share link.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!shareId) return
    const viewUrl = `${window.location.origin}/shared/${shareId}`
    await navigator.clipboard.writeText(viewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!shareUrl) {
    return (
      <div className="flex flex-col gap-2">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleShare}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-xl py-3 transition-colors"
        >
          {loading ? 'Generating link…' : 'Create shareable link'}
        </button>
      </div>
    )
  }

  const viewUrl = `${window.location.origin}/shared/${shareId}`

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-600">
        Share link is valid for <strong>7 days</strong>.
      </p>
      <div className="flex gap-2">
        <input
          readOnly
          value={viewUrl}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <a
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-500 hover:underline"
      >
        Download redacted PDF directly
      </a>
    </div>
  )
}
