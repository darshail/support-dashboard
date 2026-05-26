export default function MainContent({ children }) {
  return (
    <main className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="relative min-h-full">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.06),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(14,165,233,0.05),transparent_45%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.25]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1680px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </main>
  )
}
