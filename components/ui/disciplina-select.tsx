"use client";

import { SearchableSelect, SearchableSelectOption } from "./searchable-select";

interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  nivelEnsino: string;
  areaConhecimento: {
    id: string;
    nome: string;
  };
}

interface DisciplinaSelectProps {
  disciplinas: Disciplina[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const formatNivelEnsino = (nivel: string): string => {
  switch (nivel) {
    case "ENSINO_PRIMARIO":
      return "Ensino Primário";
    case "ENSINO_SECUNDARIO":
      return "Ensino Secundário";
    default:
      return nivel;
  }
};

const getNivelEnsinoBadgeVariant = (nivel: string): "default" | "secondary" => {
  switch (nivel) {
    case "ENSINO_PRIMARIO":
      return "default";
    case "ENSINO_SECUNDARIO":
      return "secondary";
    default:
      return "default";
  }
};

export function DisciplinaSelect({
  disciplinas,
  value,
  onValueChange,
  placeholder = "Selecione uma disciplina...",
  disabled = false,
  loading = false,
  className,
}: DisciplinaSelectProps) {
  const options: SearchableSelectOption[] = disciplinas.map((disciplina) => ({
    value: disciplina.id,
    label: disciplina.nome,
    description: disciplina.descricao || `Área: ${disciplina.areaConhecimento.nome}`,
    badge: formatNivelEnsino(disciplina.nivelEnsino),
    badgeVariant: getNivelEnsinoBadgeVariant(disciplina.nivelEnsino),
  }));

  return (
    <SearchableSelect
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={loading ? "Carregando disciplinas..." : placeholder}
      emptyText="Nenhuma disciplina encontrada."
      disabled={disabled || loading}
      className={className}
    />
  );
}