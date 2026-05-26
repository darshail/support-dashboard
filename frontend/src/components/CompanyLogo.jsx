import { APP_NAME } from '../utils/constants'

/**
 * Company logo placeholder — replace the inner content with your brand asset.
 */
export default function CompanyLogo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { box: 'h-10 w-10', text: 'text-base', sub: 'text-[10px]' },
    md: { box: 'h-12 w-12', text: 'text-lg', sub: 'text-xs' },
    lg: { box: 'h-16 w-16', text: 'text-xl', sub: 'text-sm' },
  }

  const s = sizes[size] ?? sizes.md

  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      <div
        className={[
          'flex shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary-muted',
          s.box,
        ].join(' ')}
        aria-hidden="true"
      >
        {/* Replace with <img src="/logo.svg" alt="" /> */}
        <svg
          className="h-1/2 w-1/2 text-primary/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z"
          />
        </svg>
      </div>
      {showText && (
        <div className="min-w-0">
          <p className={['font-semibold tracking-tight text-text', s.text].join(' ')}>{APP_NAME}</p>
          <p className={['text-text-muted', s.sub].join(' ')}>Your logo here</p>
        </div>
      )}
    </div>
  )
}
