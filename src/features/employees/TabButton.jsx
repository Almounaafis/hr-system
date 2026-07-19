export function TabButton({ active, icon, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 border-b-2 pb-2 sm:pb-3 transition-colors
        text-sm sm:text-lg lg:text-2xl
        whitespace-nowrap
        ${
          active
            ? "border-primary text-primary font-bold"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }
      `}
    >
      {icon}
      {children}
    </button>
  );
}