/**
 * @param {Object} props
 * @param {string} [title]
 * @param {string} [description]
 * @param {import('react').ReactNode} children
 * @param {string} [className]
 */
export default function Card({ title, description, children, className = '' }) {
  return (
    <section
      className={['card-surface flex flex-col p-5 sm:p-6', className].join(' ')}
    >
      {(title || description) && (
        <header className="mb-5 shrink-0">
          {title && (
            <h2 className="text-base font-semibold tracking-tight text-text sm:text-lg">{title}</h2>
          )}
          {description && (
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{description}</p>
          )}
        </header>
      )}
      <div className="min-w-0 flex-1">{children}</div>
    </section>
  )
}
