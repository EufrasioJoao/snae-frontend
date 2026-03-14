"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, HelpCircle } from "lucide-react";

interface EstudanteDuvidasHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export default function EstudanteDuvidasHeader({ 
  onRefresh, 
  refreshing 
}: EstudanteDuvidasHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <HelpCircle className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Dúvidas</h1>
          <p className="text-gray-600">
            Gerencie suas dúvidas acadêmicas e obtenha respostas de professores
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