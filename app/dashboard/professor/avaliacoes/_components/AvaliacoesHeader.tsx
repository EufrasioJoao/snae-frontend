"use client";

import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, GraduationCap } from "lucide-react";

interface AvaliacoesHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  onCriarQuiz: () => void;
}

export default function AvaliacoesHeader({
  onRefresh,
  refreshing,
  onCriarQuiz
}: AvaliacoesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <GraduationCap className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
          <p className="text-gray-600">Gerir quizzes e avaliações das suas disciplinas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
        
        <Button
          onClick={onCriarQuiz}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Novo Quiz
        </Button>
      </div>
    </div>
  );
}