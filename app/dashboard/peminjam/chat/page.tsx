import { getChatContacts, getMessages } from "@/actions/chat";
import { getSession } from "@/lib/auth";
import { ChatBox } from "@/components/ChatBox";
import { MessageSquare } from "lucide-react";

export default async function PeminjamChatPage() {
  const session = await getSession();
  const contacts = await getChatContacts();
  const mainPetugas = contacts[0]; // Ambil petugas pertama sebagai CS default

  if (!mainPetugas) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
        <p>Belum ada petugas yang tersedia.</p>
      </div>
    );
  }

  const initialMessages = await getMessages(mainPetugas.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Hubungi Petugas</h2>
      </div>

      <ChatBox 
        currentUserId={session.id} 
        otherUser={mainPetugas} 
        initialMessages={initialMessages} 
      />
      
      <p className="text-center text-xs text-slate-400">
        Riwayat pesan akan dibersihkan otomatis setiap 7 hari untuk keamanan data.
      </p>
    </div>
  );
}
