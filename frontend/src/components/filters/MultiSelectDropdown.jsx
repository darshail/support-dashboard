import { useEffect, useId, useRef, useState } from 'react'

/**
 * @param {Object} props
 * @param {string} label
 * @param {{ value: string, label: string }[]} options
 * @param {string[]} selected
 * @param {(values: string[]) => void} onChange
 * @param {boolean} [disabled]
 */
export default function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  function toggleValue(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  function selectAll() {
    onChange(options.map((o) => o.value))
  }

  function clearSelection() {
    onChange([])
  }

  const triggerLabel = getTriggerLabel(label, selected, options)

  return (
    <div ref={containerRef} className="relative min-w-0">
      <button
        type="button"
        disabled={disabled || options.length === 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'flex h-9 w-full min-w-[8.5rem] items-center justify-between gap-2 rounded-lg border px-3 text-left text-sm transition-all duration-200',
          disabled || options.length === 0
            ? 'cursor-not-allowed border-border bg-surface-muted text-text-subtle'
            : 'border-border bg-surface text-text hover:border-primary/40 hover:shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99]',
          selected.length > 0 && 'border-primary/30 bg-primary/5 shadow-sm',
        ].join(' ')}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronIcon
          className={['h-4 w-4 shrink-0 text-text-muted transition-transform', open && 'rotate-180'].join(
            ' ',
          )}
        />
      </button>

      {open && options.length > 0 && (
        <div
          className="absolute left-0 z-50 mt-1.5 w-full min-w-[14rem] max-w-[18rem] animate-fade-in-up rounded-xl border border-border bg-surface py-1 shadow-lg ring-1 ring-black/5"
          role="listbox"
          id={listId}
          aria-multiselectable="true"
          aria-label={`${label} options`}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <span className="text-xs font-medium text-text-muted">{label}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-medium text-primary hover:text-primary-hover"
              >
                All
              </button>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-medium text-text-muted hover:text-text"
              >
                Clear
              </button>
            </div>
          </div>

          <ul className="max-h-52 overflow-y-auto scrollbar-thin py-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.value)
              return (
                <li key={option.value}>
                  <label className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm hover:bg-surface-muted">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleValue(option.value)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                    />
                    <span className="truncate text-text">{option.label}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

/**
 * @param {string} label
 * @param {string[]} selected
 * @param {{ value: string, label: string }[]} options
 */
function getTriggerLabel(label, selected, options) {
  if (options.length === 0) return `${label}: —`
  if (selected.length === 0) return `${label}: All`

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label)

  if (selected.length === 1) return `${label}: ${selectedLabels[0]}`
  if (selected.length === options.length) return `${label}: All`
  return `${label}: ${selected.length} selected`
}

function ChevronIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
