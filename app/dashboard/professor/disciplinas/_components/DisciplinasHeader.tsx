"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, BookOpen, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface DisciplinasHeaderProps {
  onRefresh: () => void;
  onCreateContent: () => void;
  loading?: boolean;
}

export default function DisciplinasHeader({ 
  onRefresh, 
  onCreateContent, 
  loading = false 
}: DisciplinasHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Minhas Disciplinas</h1>
        <p className="text-gray-600">
          Gerencie as disciplinas que você leciona
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/professor/disciplinas/associar")}
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Associar Disciplinas
        </Button>

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>

        <Button
          onClick={onCreateContent}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Criar Conteúdo
        </Button>
      </div>
    </div>
  );
}