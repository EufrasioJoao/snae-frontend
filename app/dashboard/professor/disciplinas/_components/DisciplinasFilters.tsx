"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { DisciplinaFilters } from "../_types/professor-disciplina.types";

interface DisciplinasFiltersProps {
  filters: DisciplinaFilters;
  onFilterChange: (filters: Partial<DisciplinaFilters>) => void;
}

export default function DisciplinasFilters({ filters, onFilterChange }: DisciplinasFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar disciplinas..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <Select 
        value={filters.nivelEnsino || "all"} 
        onValueChange={(value) => onFilterChange({ nivelEnsino: value as any })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Nível de ensino" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os níveis</SelectItem>
          <SelectItem value="ENSINO_PRIMARIO">Ensino Primário</SelectItem>
          <SelectItem value="ENSINO_SECUNDARIO">Ensino Secundário</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.areaId || "all"} 
        onValueChange={(value) => onFilterChange({ areaId: value })}
      >
        <SelectTrigger className="w-full sm:w-64">
          <SelectValue placeholder="Área de conhecimento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as áreas</SelectItem>
          {/* TODO: Carregar áreas dinamicamente */}
          <SelectItem value="linguagens">Linguagens</SelectItem>
          <SelectItem value="matematica">Matemática</SelectItem>
          <SelectItem value="ciencias">Ciências Naturais</SelectItem>
          <SelectItem value="sociais">Ciências Sociais</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}