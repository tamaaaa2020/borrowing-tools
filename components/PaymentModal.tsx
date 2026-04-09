"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bayarDenda } from "@/actions/peminjaman";
import { checkPaymentStatus } from "@/actions/payment";
import { QrCode, X, CheckCircle2, ExternalLink, Loader2, RefreshCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  pengembalianId: number;
  denda: number;
  namaAlat: string;
  snapUrl?: string | null;
}

export function PaymentModal({ pengembalianId, denda, namaAlat, snapUrl }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const handlePaymentSimulation = async () => {
    setLoading(true);
    try {
      const res = await bayarDenda(pengembalianId); 
      if (res.success) {
        toast.success("Pembayaran berhasil disimulasikan!");
        setIsOpen(false);
      } else {
        toast.error(res.error || "Gagal memproses pembayaran");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const res = await checkPaymentStatus(pengembalianId);
      if (res.success) {
        toast.success("Pembayaran terverifikasi lunas!");
        setIsOpen(false);
      } else {
        toast.info(`Status: ${res.status || 'Belum dibayar'}`);
      }
    } catch (error) {
      toast.error("Gagal mengecek status");
    } finally {
      setChecking(false);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        size="sm" 
        variant="destructive" 
        onClick={() => setIsOpen(true)}
        className="bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 font-bold px-4"
      >
        Bayar Denda
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay with faster transition */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />
      
      <Card className="relative w-full max-w-[340px] border-none shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-200 bg-white flex flex-col rounded-3xl">
        <CardHeader className="bg-white border-b border-slate-50 flex flex-row items-center justify-between py-4 px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-100">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base font-black text-slate-800 tracking-tight">Pembayaran</CardTitle>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">QRIS Sandbox</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)} 
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Amount Section */}
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Tagihan</p>
              <h3 className="text-3xl font-black text-slate-900">
                Rp {Number(denda).toLocaleString('id-ID')}
              </h3>
              <p className="text-[11px] font-medium text-slate-500 italic">Denda: {namaAlat}</p>
            </div>

            {/* QR Image Container with fixed Aspect Ratio */}
            <div className="relative group mx-auto w-48 h-48">
              <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative h-full w-full bg-white border-2 border-slate-50 rounded-[2rem] p-4 shadow-sm flex items-center justify-center overflow-hidden">
                <QrCode className="h-full w-full text-slate-900" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-xl">
                    <span className="text-[10px] font-black text-blue-600 tracking-tighter">SIPERBAR PAY</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Scan QR atau Klik Link</p>
              
              <div className="grid grid-cols-1 gap-2">
                {snapUrl && (
                  <Button 
                    variant="outline"
                    className="w-full h-12 border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-2xl transition-all text-sm font-bold gap-2"
                    onClick={() => window.open(snapUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka Link Pembayaran
                  </Button>
                )}
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="secondary"
                    className="h-12 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-2xl text-xs font-bold gap-2"
                    onClick={handleCheckStatus}
                    disabled={checking}
                  >
                    {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                    Cek Status
                  </Button>
                  <Button 
                    className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
                    onClick={handlePaymentSimulation}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Bayar Sekarang"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Sandbox Aktif</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
