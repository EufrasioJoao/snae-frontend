"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { ConteudoFilters } from "../_types/conteudo.types";

interface ConteudosFiltersProps {
  filters: ConteudoFilters;
  onFilterChange: (filters: Partial<ConteudoFilters>) => void;
}

export default function ConteudosFilters({ filters, onFilterChange }: ConteudosFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar conteúdos..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <Select 
        value={filters.tipo || "all"} 
        onValueChange={(value) => onFilterChange({ tipo: value })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Tipo de conteúdo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os tipos</SelectItem>
          <SelectItem value="TEXTO">Texto</SelectItem>
          <SelectItem value="VIDEO">Vídeo</SelectItem>
          <SelectItem value="AUDIO">Áudio</SelectItem>
          <SelectItem value="PDF">PDF</SelectItem>
          <SelectItem value="IMAGEM">Imagem</SelectItem>
          <SelectItem value="LINK">Link Externo</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.status || "all"} 
        onValueChange={(value) => onFilterChange({ status: value as any })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="publicado">Aprovados</SelectItem>
          <SelectItem value="pendente">Pendentes</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.disciplinaId || "all"} 
        onValueChange={(value) => onFilterChange({ disciplinaId: value })}
      >
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Disciplina" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as disciplinas</SelectItem>
          {/* TODO: Carregar disciplinas dinamicamente */}
          <SelectItem value="matematica">Matemática</SelectItem>
          <SelectItem value="portugues">Português</SelectItem>
          <SelectItem value="ciencias">Ciências</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}