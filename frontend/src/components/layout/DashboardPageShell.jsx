import AlertBanner from '../ui/AlertBanner'
import { DashboardPageSkeleton } from '../ui/Skeleton'

/**
 * @param {Object} props
 * @param {boolean} isLoading
 * @param {string | null} [error]
 * @param {'overview' | 'executive' | 'analytics'} [skeletonVariant]
 * @param {import('react').ReactNode} children
 */
export default function DashboardPageShell({
  isLoading,
  error,
  skeletonVariant = 'analytics',
  children,
}) {
  if (isLoading) {
    return <DashboardPageSkeleton variant={skeletonVariant} />
  }

  return (
    <div className="dashboard-section animate-page-enter">
      {error && <AlertBanner message={error} />}
      {children}
    </div>
  )
}
