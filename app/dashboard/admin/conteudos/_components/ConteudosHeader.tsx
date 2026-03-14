"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Download, FileText } from "lucide-react";

interface ConteudosHeaderProps {
  onRefresh: () => void;
}

export default function ConteudosHeader({ onRefresh }: ConteudosHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Conteúdos</h1>
        <p className="text-gray-600 mt-1">
          Moderar e aprovar conteúdos educacionais da biblioteca digital
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
}