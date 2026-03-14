"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface EstudanteDisciplinasHeaderProps {
  onAssociar: () => void;
  onRefresh: () => void;
}

export default function EstudanteDisciplinasHeader({
  onAssociar,
  onRefresh,
}: EstudanteDisciplinasHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Disciplinas</h1>
        <p className="text-gray-600">
          Gerencie as disciplinas que você está estudando
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
        <Button onClick={onAssociar}>
          <Plus className="w-4 h-4 mr-2" />
          Associar Disciplinas
        </Button>
      </div>
    </div>
  );
}