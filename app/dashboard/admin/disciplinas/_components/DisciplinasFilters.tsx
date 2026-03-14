"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { AreaConhecimento } from "../_types/disciplina.types";

interface DisciplinasFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  nivelFilter: string;
  onNivelChange: (value: string) => void;
  areaFilter: string;
  onAreaChange: (value: string) => void;
  areas: AreaConhecimento[];
}

export default function DisciplinasFilters({
  searchTerm,
  onSearchChange,
  nivelFilter,
  onNivelChange,
  areaFilter,
  onAreaChange,
  areas,
}: DisciplinasFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar disciplinas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={nivelFilter} onValueChange={onNivelChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filtrar por nível" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os níveis</SelectItem>
          <SelectItem value="ENSINO_PRIMARIO">Ensino Primário</SelectItem>
          <SelectItem value="ENSINO_SECUNDARIO">Ensino Secundário</SelectItem>
        </SelectContent>
      </Select>

      <Select value={areaFilter} onValueChange={onAreaChange}>
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Filtrar por área" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as áreas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area.id} value={area.id}>
              {area.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}