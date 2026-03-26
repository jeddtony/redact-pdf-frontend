interface Props {
  pages: string[]
  label?: string
}

export default function PDFPreview({ pages, label }: Props) {
  if (pages.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[70vh] border border-gray-200 rounded-xl p-3 bg-gray-50">
        {pages.map((url, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <img
              src={url}
              alt={`Page ${i + 1}`}
              className="max-w-full rounded shadow"
              loading="lazy"
            />
            <span className="text-xs text-gray-400">Page {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
