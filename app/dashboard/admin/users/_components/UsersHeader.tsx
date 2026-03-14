"use client";

import { Plus, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsersHeaderProps {
  onCreateUser: () => void;
  onRefresh: () => void;
}

export default function UsersHeader({  onCreateUser, onRefresh }: UsersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Utilizadores</h1>
        <p className="text-gray-600 mt-1">
          Gerir todos os utilizadores do sistema SNAE
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
        <Button size="sm" onClick={onCreateUser}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Utilizador
        </Button>
      </div>
    </div>
  );
}