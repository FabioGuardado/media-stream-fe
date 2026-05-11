import { useThumbnail } from '../../hooks/useThumbnail';

const TYPE_ICONS = {
  video: '▶',
  audio: '♪',
  image: '⬚',
};

const TYPE_COLORS = {
  video: 'bg-accent/20 text-accent',
  audio: 'bg-purple-500/20 text-purple-400',
  image: 'bg-emerald-500/20 text-emerald-400',
};

export default function MediaCard({ item, streamUrl, onClick }) {
  const { thumbnail, loading } = useThumbnail(item.type === 'video' ? streamUrl : null);

  const showPlaceholder = !thumbnail;

  return (
    <article
      onClick={onClick}
      className="group rounded-xl overflow-hidden glass hover:border-accent/40
                        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                        hover:shadow-accent/10 cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-card">
        {!showPlaceholder ? (
          <img
            src={thumbnail}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-muted">
            {loading ? (
              <span className="animate-pulse opacity-40">{TYPE_ICONS[item.type]}</span>
            ) : (
              TYPE_ICONS[item.type]
            )}
          </div>
        )}

        <span
          className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium
                      ${TYPE_COLORS[item.type]}`}
        >
          {item.type}
        </span>

        {item.duration && (
          <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-1.5 py-0.5 rounded">
            {item.duration}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-white text-base leading-tight line-clamp-1 mb-1 group-hover:text-accent transition-colors">
          {item.title}
        </h3>
        <p className="text-muted text-xs line-clamp-2 mb-3">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-subtle">
          <span>{item.genre}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
