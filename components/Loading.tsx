import { Card, CardContent } from "@/components/ui/card"

export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 ${className}`}>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingCard({ className = "" }: { className?: string }) {
  return (
    <Card className={`border-none bg-white/80 backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner className="h-12 w-12" />
        </div>
      </CardContent>
    </Card>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse"></div>
      ))}
    </div>
  )
}

export function LoadingStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-none bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-16"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function LoadingForm() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-10 bg-slate-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  )
}