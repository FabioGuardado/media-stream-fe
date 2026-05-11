import { useNavigate } from 'react-router-dom'
import { useMediaStore } from '../store/useMediaStore'
import MediaCard from '../components/media/MediaCard'

export default function Home() {
  const items        = useMediaStore((s) => s.items)
  const getStreamUrl = useMediaStore((s) => s.getStreamUrl)
  const navigate     = useNavigate()

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 page-enter">
      {/* Hero heading */}
      <div className="mb-10">
        <h2 className="font-display text-5xl font-extrabold text-white leading-tight">
          Explora<br />
          <span className="text-accent">& Reproduce</span>
        </h2>
        <p className="text-muted mt-2 text-base">
          Explora nuestra biblioteca de medios — videos y audios.
        </p>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="text-center py-24 text-muted">
          <p className="text-5xl mb-4">◌</p>
          <p className="text-lg">Sin contenido aún. Pídele a un administrador que suba archivos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              streamUrl={getStreamUrl(item.filename)}
              onClick={() => navigate(`/media/${item.id}`)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
