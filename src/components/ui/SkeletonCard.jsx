export default function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden glass animate-skeleton">
      <div className="w-full aspect-video bg-card" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-card rounded w-3/4" />
        <div className="h-3 bg-card rounded w-full" />
        <div className="h-3 bg-card rounded w-2/3" />
        <div className="flex justify-between mt-2">
          <div className="h-3 bg-card rounded w-16" />
          <div className="h-3 bg-card rounded w-12" />
        </div>
      </div>
    </div>
  );
}
