export function Brand({ label = "HD" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2" aria-label="Brand">
      <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-[#367aff]" />
      <span className="text-sm font-medium text-[#111827]">{label}</span>
    </div>
  )
}
