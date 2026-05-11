export default function Input({
  label,
  id,
  error,
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        id={id}
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-md bg-panel border
          text-white text-sm placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
          transition-all
          ${error ? 'border-red-500' : 'border-border'}
          ${className}
        `}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
