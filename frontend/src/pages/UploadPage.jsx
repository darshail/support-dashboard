import PagePlaceholder from '../components/PagePlaceholder'

export default function UploadPage() {
  return (
    <PagePlaceholder
      title="Upload"
      description="Import CSV files with PapaParse for bulk ticket data."
    >
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-surface-muted px-6 py-12 text-center">
        <p className="text-sm font-medium text-text">Drop CSV file here</p>
        <p className="mt-1 text-xs text-text-muted">or click to browse</p>
      </div>
    </PagePlaceholder>
  )
}
