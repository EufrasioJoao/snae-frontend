"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, BookOpen } from "lucide-react";

interface DisciplinasHeaderProps {
  onCreateDisciplina: () => void;
  onCreateArea: () => void;
}

export default function DisciplinasHeader({ 
  onCreateDisciplina, 
  onCreateArea 
}: DisciplinasHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Disciplinas</h1>
        <p className="text-gray-600 mt-1">
          Gerir disciplinas e áreas de conhecimento do sistema SNAE
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={onCreateArea}>
          <BookOpen className="w-4 h-4 mr-2" />
          Nova Área
        </Button>
        
        <Button size="sm" onClick={onCreateDisciplina}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Disciplina
        </Button>
      </div>
    </div>
  );
}