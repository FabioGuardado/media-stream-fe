export default function CategoryTag({ name }) {
  if (!name) return null;
  return (
    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-medium border bg-amber/10 text-amber border-amber/20">
      {name}
    </span>
  );
}
