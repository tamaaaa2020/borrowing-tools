"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { createPaymentLink, checkPaymentStatus } from "@/actions/payment";
import { toast } from "sonner";
import { RefreshCcw } from "lucide-react";

interface KirimTagihanButtonProps {
  pengembalianId: number;
  statusPembayaran: string;
  denda: number;
  hasSnapToken?: boolean;
}

export default function KirimTagihanButton({ pengembalianId, statusPembayaran, denda, hasSnapToken }: KirimTagihanButtonProps) {
  const [loading, setLoading] = useState(false);

  if (statusPembayaran === "LUNAS" || denda <= 0) return null;

  const handleKirim = async () => {
    setLoading(true);
    try {
      const res = await createPaymentLink(pengembalianId);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Tagihan QRIS berhasil dibuat dan dikirim ke user!");
        if (res.snapUrl) {
          window.open(res.snapUrl, "_blank");
        }
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setLoading(true);
    try {
      const res = await checkPaymentStatus(pengembalianId);
      if (res.success) {
        toast.success("Pembayaran telah lunas!");
      } else {
        toast.info(`Status: ${res.status || 'Belum dibayar'}`);
      }
    } catch (error) {
      toast.error("Gagal mengecek status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      {hasSnapToken && (
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
          onClick={handleCheckStatus}
          disabled={loading}
          title="Cek Status Pembayaran"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      )}
      <Button 
        size="sm" 
        variant="outline" 
        className="h-8 text-[10px] gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
        onClick={handleKirim}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Send className="h-3 w-3" />
        )}
        {hasSnapToken ? "Kirim Ulang" : "Kirim Tagihan"}
      </Button>
    </div>
  );
}

