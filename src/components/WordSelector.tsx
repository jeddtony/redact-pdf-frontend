import { useState, useMemo } from 'react'

interface Props {
  wordFrequencies: Record<string, number>
  selected: Set<string>
  suggested: Set<string>
  onToggle: (word: string) => void
  onConfirm: () => void
  onAutoDetect: () => void
  redacting: boolean
  detecting: boolean
}

export default function WordSelector({
  wordFrequencies,
  selected,
  suggested,
  onToggle,
  onConfirm,
  onAutoDetect,
  redacting,
  detecting,
}: Props) {
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    return Object.entries(wordFrequencies).sort(([, a], [, b]) => b - a)
  }, [wordFrequencies])

  const filtered = useMemo(() => {
    if (!search.trim()) return sorted
    const q = search.toLowerCase()
    return sorted.filter(([word]) => word.toLowerCase().includes(q))
  }, [sorted, search])

  return (
    <div className="flex flex-col gap-4">
      {/* Auto-detect button */}
      <button
        onClick={onAutoDetect}
        disabled={detecting || redacting}
        className="w-full flex items-center justify-center gap-2 border border-blue-300 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-700 font-medium rounded-xl py-2.5 text-sm transition-colors"
      >
        {detecting ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Detecting sensitive data…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
            </svg>
            Auto-detect sensitive data with Claude AI
          </>
        )}
      </button>

      {suggested.size > 0 && (
        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          <strong>{suggested.size}</strong> sensitive item{suggested.size !== 1 ? 's' : ''} suggested — highlighted below.
        </p>
      )}

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search words…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {selected.size} selected
        </span>
      </div>

      {/* Word list */}
      <div className="border border-gray-200 rounded-xl overflow-y-auto max-h-72 divide-y divide-gray-100">
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No words found.</p>
        )}
        {filtered.map(([word, count]) => {
          const isSelected = selected.has(word)
          const isSuggested = suggested.has(word) && !isSelected

          return (
            <button
              key={word}
              onClick={() => onToggle(word)}
              className={`
                w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors
                ${isSelected
                  ? 'bg-red-50 text-red-700'
                  : isSuggested
                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'hover:bg-gray-50 text-gray-700'}
              `}
            >
              <span className={`font-mono ${isSelected ? 'line-through' : ''}`}>
                {word}
              </span>
              <div className="flex items-center gap-2 ml-2">
                {isSuggested && (
                  <span className="text-xs bg-amber-200 text-amber-700 rounded-full px-1.5 py-0.5 font-medium">
                    AI
                  </span>
                )}
                <span className="text-xs text-gray-400">{count}×</span>
              </div>
            </button>
          )
        })}
      </div>

      <button
        onClick={onConfirm}
        disabled={selected.size === 0 || redacting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold rounded-xl py-3 transition-colors"
      >
        {redacting ? 'Redacting…' : `Redact ${selected.size} word${selected.size !== 1 ? 's' : ''}`}
      </button>
    </div>
  )
}
