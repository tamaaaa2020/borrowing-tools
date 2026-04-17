import { getChatContacts, getMessages, clearOldMessages } from "@/actions/chat";
import { getSession } from "@/lib/auth";
import { ChatBox } from "@/components/ChatBox";
import { MessageSquare, Users, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

export default async function PetugasChatPage({
  searchParams,
}: {
  searchParams: Promise<{ user?: string }>;
}) {
  const session = await getSession();
  const resolvedParams = await searchParams;
  const contacts = await getChatContacts();
  const selectedUserId = resolvedParams.user ? parseInt(resolvedParams.user) : null;
  
  const selectedUser = contacts.find(c => c.id === selectedUserId);
  const initialMessages = selectedUserId ? await getMessages(selectedUserId) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Panel Customer Service</h2>
        </div>
        <form action={async () => {
          "use server";
          await clearOldMessages();
          revalidatePath("/dashboard/petugas/chat");
        }}>
          <Button size="sm" variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50">
            <Trash2 className="h-4 w-4 mr-2" />
            Bersihkan Chat Lama (&gt;7 Hari)
          </Button>
        </form>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <h3 className="font-bold text-sm text-slate-700">Daftar Peminjam</h3>
          </div>
          <div className="divide-y divide-slate-50 overflow-y-auto max-h-[440px]">
            {contacts.map((contact) => (
              <Link 
                key={contact.id} 
                href={`/dashboard/petugas/chat?user=${contact.id}`}
                className={`flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors ${selectedUserId === contact.id ? "bg-emerald-50 border-r-4 border-emerald-500" : ""}`}
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                  {contact.nama[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{contact.nama}</p>
                  <p className="text-xs text-slate-400">@{contact.username}</p>
                </div>
              </Link>
            ))}
            {contacts.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-400 italic">Belum ada peminjam terdaftar.</p>
            )}
          </div>
        </div>

        {/* Chat Box */}
        <div className="md:col-span-2">
          {selectedUser ? (
            <ChatBox 
              key={selectedUser.id}
              currentUserId={session.id} 
              otherUser={selectedUser} 
              initialMessages={initialMessages} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 min-h-[500px]">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <p>Pilih peminjam untuk memulai chat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
