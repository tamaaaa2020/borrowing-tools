"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl">
        <CardHeader className="text-center space-y-1 pt-10 pb-6">
          <div className="mx-auto bg-red-100 w-20 h-20 rounded-3xl flex items-center justify-center mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Terjadi Kesalahan
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Maaf, terjadi masalah yang tidak terduga
          </p>
        </CardHeader>
        
        <CardContent className="p-8 pt-0 space-y-6">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-slate-700 font-mono break-all">
              {error.message || "Terjadi kesalahan dalam aplikasi"}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={reset}
              variant="gradient"
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Jika masalah berlanjut, hubungi administrator sistem
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}