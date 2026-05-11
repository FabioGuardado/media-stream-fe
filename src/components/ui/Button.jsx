const variants = {
  primary: 'bg-accent hover:bg-accent-hover text-white',
  secondary: 'bg-card hover:bg-border text-white border border-border',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'text-muted hover:text-white hover:bg-card',
  amber: 'bg-amber hover:bg-yellow-600 text-surface font-semibold',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
