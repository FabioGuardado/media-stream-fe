import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useMediaStore } from '../store/useMediaStore'
import { useThumbnail } from '../hooks/useThumbnail'

/** Format seconds → m:ss */
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return null
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function MetaRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 py-3 border-b border-border last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-white break-all">{value}</span>
    </div>
  )
}

export default function MediaDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const items        = useMediaStore((s) => s.items)
  const getStreamUrl = useMediaStore((s) => s.getStreamUrl)

  const item = items.find((i) => i.id === id)
  if (!item) return <Navigate to="/" replace />

  const streamUrl = getStreamUrl(item.filename)

  // Poster only for video
  const { thumbnail } = useThumbnail(item.type === 'video' ? streamUrl : null)

  // Player metadata extracted once the browser loads the first frames
  const [duration,   setDuration]   = useState(null)
  const [resolution, setResolution] = useState(null)

  const handleLoadedMetadata = (e) => {
    const el = e.currentTarget
    setDuration(formatDuration(el.duration))
    if (item.type === 'video' && el.videoWidth) {
      setResolution(`${el.videoWidth} × ${el.videoHeight}`)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 page-enter">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted hover:text-white
                   transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Volver
      </button>

      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Player */}
        <div className="rounded-xl overflow-hidden bg-black shadow-2xl shadow-black/40">
          {item.type === 'video' ? (
            <video
              src={streamUrl}
              poster={thumbnail ?? undefined}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full aspect-video"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 py-16 px-8">
              <span className="text-7xl text-purple-400 opacity-60">♪</span>
              <audio
                src={streamUrl}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Metadata panel */}
        <div className="glass rounded-xl p-6">
          <h1 className="font-display text-2xl font-extrabold text-white leading-tight mb-1 [overflow-wrap:anywhere]">
            {item.title}
          </h1>

          <span
            className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-6
              ${item.type === 'video'
                ? 'bg-accent/20 text-accent'
                : 'bg-purple-500/20 text-purple-400'}`}
          >
            {item.type}
          </span>

          <div>
            <MetaRow label="Archivo"    value={item.filename} />
            <MetaRow label="Subido"     value={new Date(item.createdAt).toLocaleString()} />
            <MetaRow label="Duración"   value={duration} />
            <MetaRow label="Resolución" value={resolution} />
          </div>
        </div>
      </div>
    </main>
  )
}
