import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function LoadingAuth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 pt-10 pb-6 text-center bg-gradient-to-r from-blue-600 to-emerald-600">
          <div className="mx-auto bg-white/20 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 animate-pulse">
            <div className="h-10 w-10 bg-white/30 rounded-full"></div>
          </div>
          <div className="h-8 bg-white/20 rounded-lg w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded-lg w-48 mx-auto animate-pulse"></div>
        </CardHeader>
        
        <CardContent className="p-8 pt-10">
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 rounded-lg w-20 animate-pulse"></div>
                <div className="h-12 bg-slate-200 rounded-xl animate-pulse"></div>
              </div>
            ))}
            
            <div className="h-12 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl animate-pulse"></div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <div className="h-4 bg-slate-200 rounded-lg w-48 mx-auto animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-32 mx-auto animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}