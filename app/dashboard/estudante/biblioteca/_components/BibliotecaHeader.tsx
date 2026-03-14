"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Library } from "lucide-react";

interface BibliotecaHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export default function BibliotecaHeader({ 
  onRefresh, 
  refreshing 
}: BibliotecaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
          <Library className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca Digital</h1>
          <p className="text-gray-600">
            Acesse conteúdos educacionais, livros, módulos e materiais de apoio
          </p>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onRefresh}
        disabled={refreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        Atualizar
      </Button>
    </div>
  );
}