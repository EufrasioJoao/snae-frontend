export interface ProfessorDisciplina {
  id: string;
  nome: string;
  descricao?: string;
  nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  areaConhecimento: {
    id: string;
    nome: string;
  };
  // Estatísticas específicas do professor
  totalEstudantes: number;
  totalConteudos: number;
  totalDuvidas: number;
  duvidasPendentes: number;
  ultimaAtividade?: string;
}

export interface ProfessorDisciplinaStats {
  totalDisciplinas: number;
  totalEstudantes: number;
  totalConteudos: number;
  totalDuvidas: number;
  duvidasPendentes: number;
  conteudosPendentes: number;
  disciplinasMaisAtivas: {
    nome: string;
    estudantes: number;
    duvidas: number;
  }[];
}

export interface DisciplinaFilters {
  search?: string;
  nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO" | "all";
  areaId?: string;
}