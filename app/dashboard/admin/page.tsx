import { Suspense } from "react"
import { LoadingDashboard } from "@/components/LoadingStates"
import DashboardContent from "./DashboardContent"

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<LoadingDashboard />}>
      <DashboardContent />
    </Suspense>
  )
}