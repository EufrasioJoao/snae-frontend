"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";

type Session = typeof auth.$Infer.Session;

export default function Navigation({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="px-4 bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                SNAE
              </span>
              <span className="text-xs text-gray-600 -mt-1">
                Aprender Sempre
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${isActive("/")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
                }`}
            >
              Início
            </Link>

            {session && (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:scale-105"
              >
                Meu Painel
              </Link>
            )}

            {!session && (
              <Link
                href="/auth"
                className="text-blue-600 border-2 border-blue-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all hover:scale-105"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
