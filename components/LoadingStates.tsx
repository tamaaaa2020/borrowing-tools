import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, ClipboardList, CheckCircle, TrendingUp, Clock } from "lucide-react"

export function LoadingDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-64 mt-2 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="h-4 bg-slate-200 rounded-lg w-20 animate-pulse"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-12 mt-1 animate-pulse"></div>
          </div>
          <div className="bg-slate-200 w-12 h-12 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-none bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-slate-200 rounded-lg w-24"></div>
                  <div className="bg-slate-200 w-8 h-8 rounded-lg"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded-lg w-16 mt-2"></div>
                <div className="h-3 bg-slate-200 rounded-lg w-20 mt-1"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="h-6 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
            <div className="bg-slate-200 w-5 h-5 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse">
                  <div>
                    <div className="h-4 bg-slate-200 rounded-lg w-24 mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded-lg w-32"></div>
                  </div>
                  <div className="bg-slate-200 w-16 h-6 rounded-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="h-6 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
            <div className="bg-slate-200 w-5 h-5 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg animate-pulse">
              <div>
                <div className="h-3 bg-slate-200 rounded-lg w-24 mb-1"></div>
                <div className="h-6 bg-slate-200 rounded-lg w-16"></div>
              </div>
              <div className="bg-slate-200 w-8 h-8 rounded-lg"></div>
            </div>
            
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded-lg w-20"></div>
                  <div className="h-4 bg-slate-200 rounded-lg w-8"></div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-slate-300 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-none bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="h-6 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}