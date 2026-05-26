/**
 * @param {Object} props
 * @param {string} title
 * @param {string} [description]
 * @param {string} [meta]
 */
export default function PageHeader({ title, description, meta }) {
  return (
    <header className="animate-fade-in-up space-y-1.5">
      <h2 className="text-xl font-semibold tracking-tight text-text sm:text-2xl">{title}</h2>
      {description && (
        <p className="max-w-3xl text-sm leading-relaxed text-text-muted sm:text-[0.9375rem]">
          {description}
        </p>
      )}
      {meta && <p className="text-xs text-text-subtle">{meta}</p>}
    </header>
  )
}
