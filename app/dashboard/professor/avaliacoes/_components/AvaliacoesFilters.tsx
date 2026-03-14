"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { AvaliacaoFilters } from "../_types/professor-avaliacao.types";
import apiRequests from "@/lib/api-requests";

interface AvaliacoesFiltersProps {
  filters: AvaliacaoFilters;
  onFilterChange: (filters: Partial<AvaliacaoFilters>) => void;
}

export default function AvaliacoesFilters({
  filters,
  onFilterChange
}: AvaliacoesFiltersProps) {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ search: searchValue });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDisciplinas = async () => {
    try {
      const response = await apiRequests.professor.getDisciplinas({});
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  };

  const handleClearFilters = () => {
    setSearchValue("");
    onFilterChange({
      search: "",
      disciplinaId: "all",
      status: "all"
    });
  };

  const hasActiveFilters = filters.search || filters.disciplinaId !== "all" || filters.status !== "all";

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pesquisar por título do quiz..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={filters.disciplinaId}
          onValueChange={(value) => onFilterChange({ disciplinaId: value })}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas as disciplinas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as disciplinas</SelectItem>
            {disciplinas.map((disciplina) => (
              <SelectItem key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value as any })}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="publicado">Publicados</SelectItem>
            <SelectItem value="rascunho">Rascunhos</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}