"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, MessageCircleQuestion, Filter } from "lucide-react";

interface DuvidasHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
  totalPendentes: number;
}

export default function DuvidasHeader({ 
  onRefresh, 
  loading = false,
  totalPendentes 
}: DuvidasHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dúvidas dos Alunos</h1>
        <p className="text-gray-600">
          Responda às dúvidas dos seus estudantes
          {totalPendentes > 0 && (
            <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              {totalPendentes} pendentes
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}