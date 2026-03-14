"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { BibliotecaFilters as FiltersType } from "../_types/biblioteca.types";
import apiRequests from "@/lib/api-requests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BibliotecaFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: Partial<FiltersType>) => void;
}

export default function BibliotecaFilters({ 
  filters, 
  onFilterChange 
}: BibliotecaFiltersProps) {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    try {
      const response = await apiRequests.estudante.getDisciplinas();
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: localSearch });
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    onFilterChange({
      search: "",
      disciplinaId: "",
      tipo: "TODOS"
    });
  };

  const hasActiveFilters = filters.search || filters.disciplinaId || filters.tipo !== "TODOS";

  const tiposConteudo = [
    { value: "TODOS", label: "Todos os tipos" },
    { value: "LIVRO", label: "Livros" },
    { value: "MODULO", label: "Módulos" },
    { value: "MATERIAL_COMPLEMENTAR", label: "Materiais Complementares" },
    { value: "ARTIGO", label: "Artigos" },
    { value: "VIDEO", label: "Vídeos" },
    { value: "EXERCICIO", label: "Exercícios" }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por título, descrição ou autor..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>

      <div className="flex gap-2">
        <Select
          value={filters.disciplinaId || "all"}
          onValueChange={(value) => onFilterChange({ disciplinaId: value === "all" ? "" : value })}
        >
          <SelectTrigger className="w-[200px]">
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
          value={filters.tipo}
          onValueChange={(value) => onFilterChange({ tipo: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo de conteúdo" />
          </SelectTrigger>
          <SelectContent>
            {tiposConteudo.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearFilters}
            title="Limpar filtros"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}