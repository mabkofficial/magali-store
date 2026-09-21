export function AuthDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <span className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-surface px-3 text-[10px] uppercase tracking-[0.14em] text-muted">
          Or
        </span>
      </div>
    </div>
  );
}
