"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PrintButtonProps {
  data: any[];
}

export function PrintButton({ data }: PrintButtonProps) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('id-ID');

    // Kop Surat
    doc.setFontSize(18);
    doc.text("SIPERBAR - LAPORAN PEMINJAMAN", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("Sistem Informasi Peminjaman Barang Sekolah", 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(12);
    doc.text(`Tanggal Cetak: ${date}`, 20, 42);

    // Tabel Laporan
    const tableRows = data.map((item) => [
      `#${item.id}`,
      item.user.nama,
      item.alat.nama,
      new Date(item.tanggal_pinjam).toLocaleDateString('id-ID'),
      item.pengembalian 
        ? new Date(item.pengembalian.tanggal_kembali_aktual).toLocaleDateString('id-ID')
        : new Date(item.tanggal_kembali_rencana).toLocaleDateString('id-ID') + " (Rnc)",
      item.status,
      item.pengembalian ? `Rp ${Number(item.pengembalian.denda).toLocaleString('id-ID')}` : "Rp 0"
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["ID", "Peminjam", "Barang", "Pinjam", "Kembali", "Status", "Denda"]],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9 },
    });

    // Save PDF
    doc.save(`Laporan_SIPERBAR_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="flex gap-2 no-print">
      <Button 
        onClick={exportPDF} 
        variant="outline"
        className="border-blue-200 text-blue-600 hover:bg-blue-50 font-bold"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Simpan PDF
      </Button>
      <Button 
        onClick={() => window.print()} 
        className="bg-slate-900 hover:bg-black text-white font-bold"
      >
        <Printer className="h-4 w-4 mr-2" />
        Cetak Laporan
      </Button>
    </div>
  );
}
