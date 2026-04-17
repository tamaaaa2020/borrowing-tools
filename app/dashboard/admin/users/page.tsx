import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateUserStatus, deleteUser, autoRejectPendingUsers } from "@/actions/user";
import { UserCheck, UserX, Trash2, Clock, Pencil } from "lucide-react";

export default async function UsersPage() {
  await autoRejectPendingUsers();

  const users = await prisma.user.findMany({
    orderBy: [
      { status: "asc" }, // Tampilkan PENDING di atas
      { createdAt: "desc" }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Pengguna</h2>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-700">Daftar Seluruh Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Nama & Username</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Terdaftar</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-700">{user.nama}</div>
                        <div className="text-xs text-slate-400">@{user.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${user.role === "ADMIN" ? "bg-blue-100 text-blue-700" : 
                            user.role === "PETUGAS" ? "bg-sky-100 text-sky-700" :
                            "bg-slate-100 text-slate-700"}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${user.status === "APPROVED" ? "bg-blue-50 text-blue-600 border border-blue-100" : 
                            user.status === "PENDING" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-rose-50 text-rose-600 border border-rose-100"}`}>
                          {user.status === "PENDING" && <Clock className="h-3 w-3" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          {user.status === "PENDING" && (
                            <>
                              <form action={async () => {
                                "use server";
                                await updateUserStatus(user.id, "APPROVED");
                              }}>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-8 px-3 shadow-blue-100">
                                  <UserCheck className="h-4 w-4 mr-1" /> Setujui
                                </Button>
                              </form>
                              <form action={async () => {
                                "use server";
                                await updateUserStatus(user.id, "REJECTED");
                              }}>
                                <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 h-8 px-3">
                                  <UserX className="h-4 w-4 mr-1" /> Tolak
                                </Button>
                              </form>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {user.role !== "ADMIN" && (
                            <form action={async () => {
                              "use server";
                              await deleteUser(user.id);
                            }}>
                              <Button size="sm" variant="ghost" className="text-slate-400 hover:text-rose-600 h-8 w-8 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 italic">
                        Belum ada pengguna terdaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
