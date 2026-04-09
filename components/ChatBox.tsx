"use client";

import { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User as UserIcon, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: Date;
}

interface ChatBoxProps {
  currentUserId: number;
  otherUser: { id: number; nama: string };
  initialMessages: any[];
}

export function ChatBox({ currentUserId, otherUser, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channelName = `chat-${Math.min(currentUserId, otherUser.id)}-${Math.max(currentUserId, otherUser.id)}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [currentUserId, otherUser.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    const formData = new FormData();
    formData.append("content", input);
    formData.append("receiverId", otherUser.id.toString());

    setInput("");
    try {
      await sendMessage(formData);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <div className="bg-emerald-500 p-2 rounded-full">
          <UserIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{otherUser.nama}</h3>
          <p className="text-[10px] text-emerald-100 uppercase tracking-widest">Customer Service</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.senderId === currentUserId
                    ? "bg-emerald-600 text-white rounded-tr-none"
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                }`}
              >
                {msg.content}
                <div className={`text-[9px] mt-1 flex items-center gap-1 ${msg.senderId === currentUserId ? "text-emerald-100" : "text-slate-400"}`}>
                  <Clock className="h-2 w-2" />
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pesan..."
          className="bg-slate-50 border-none focus:ring-emerald-500"
          disabled={isSending}
        />
        <Button type="submit" size="icon" className="bg-emerald-600 hover:bg-emerald-700 shrink-0" disabled={isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
