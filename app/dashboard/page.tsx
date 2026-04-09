import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Redirect based on role
  switch (session.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "PETUGAS":
      redirect("/dashboard/petugas");
    case "PEMINJAM":
      redirect("/dashboard/peminjam");
    default:
      redirect("/auth/login");
  }
}
