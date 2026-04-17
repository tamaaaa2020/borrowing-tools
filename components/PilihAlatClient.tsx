"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ajukanPeminjaman } from "@/actions/peminjaman";
import { ShoppingCart, Trash2, Plus, Minus, Package, Clock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Alat {
  id: number;
  nama: string;
  deskripsi: string | null;
  stok: number;
  kategori: { nama: string };
  rak?: { nama: string, lokasi: string } | null;
}

export default function PilihAlatClient({ alats }: { alats: Alat[] }) {
  const [cart, setCart] = useState<{ alat: Alat, jumlah: number }[]>([]);
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addToCart = (alat: Alat) => {
    const existing = cart.find(item => item.alat.id === alat.id);
    if (existing) {
      if (existing.jumlah >= alat.stok) {
        toast.error("Stok tidak mencukupi");
        return;
      }
      setCart(cart.map(item => 
        item.alat.id === alat.id ? { ...item, jumlah: item.jumlah + 1 } : item
      ));
    } else {
      setCart([...cart, { alat, jumlah: 1 }]);
    }
    toast.success(`${alat.nama} ditambahkan ke keranjang`);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.alat.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.alat.id === id) {
        const newJumlah = item.jumlah + delta;
        if (newJumlah > 0 && newJumlah <= item.alat.stok) {
          return { ...item, jumlah: newJumlah };
        }
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (!tanggalKembali) {
      toast.error("Pilih tanggal kembali rencana");
      return;
    }
    if (cart.length === 0) {
      toast.error("Keranjang kosong");
      return;
    }

    setLoading(true);
    const items = cart.map(item => ({ id_alat: item.alat.id, jumlah: item.jumlah }));
    const result = await ajukanPeminjaman(items, tanggalKembali);

    if (result.success) {
      toast.success("Peminjaman berhasil diajukan!");
      setCart([]);
      setTanggalKembali("");
      router.push("/dashboard/peminjam/riwayat");
    } else {
      toast.error(result.error || "Gagal mengajukan peminjaman");
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Daftar Alat */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {alats.map((alat) => (
            <Card key={alat.id} className="group hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">{alat.nama}</CardTitle>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {alat.kategori.nama}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
                  {alat.deskripsi || "Tidak ada deskripsi."}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-slate-600">
                    <Package className="h-4 w-4 mr-1.5 text-slate-400" />
                    <span>Stok: <span className="font-bold text-slate-900">{alat.stok}</span></span>
                  </div>
                </div>
                {alat.rak && (
                  <div className="text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded-lg border border-amber-100 flex items-center">
                    <span className="font-semibold mr-1">Lokasi:</span> {alat.rak.nama} ({alat.rak.lokasi})
                  </div>
                )}
                <Button 
                  onClick={() => addToCart(alat)} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Tambah ke Keranjang
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keranjang Belanja */}
      <div className="space-y-6">
        <Card className="sticky top-24 border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-6">
            <CardTitle className="flex items-center text-xl">
              <ShoppingCart className="h-6 w-6 mr-3" />
              Keranjang Pinjam
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingCart className="h-8 w-8" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Keranjang masih kosong</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.alat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-bold text-slate-800 truncate">{item.alat.nama}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase">{item.alat.kategori.nama}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                          <button 
                            onClick={() => updateQuantity(item.alat.id, -1)}
                            className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-blue-600"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.jumlah}</span>
                          <button 
                            onClick={() => updateQuantity(item.alat.id, 1)}
                            className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-blue-600"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.alat.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <Clock className="h-3 w-3 mr-1.5" />
                      Rencana Kembali
                    </label>
                    <Input 
                      type="date" 
                      value={tanggalKembali}
                      onChange={(e) => setTanggalKembali(e.target.value)}
                      className="rounded-xl border-slate-200 focus:ring-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleCheckout} 
                    disabled={loading || cart.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-6 shadow-lg shadow-blue-100"
                  >
                    {loading ? "Memproses..." : "Ajukan Peminjaman"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
