export interface Duvida {
  id: string;
  titulo: string;
  descricao: string;
  disciplinaId: string;
  disciplina: {
    id: string;
    nome: string;
  };
  estudanteId: string;
  estudante: {
    id: string;
    name: string;
    anoEscolar: number | null;
  };
  status: "PENDENTE" | "EM_ANALISE" | "RESPONDIDA" | "FECHADA";
  prioridade?: "BAIXA" | "MEDIA" | "ALTA"; // Optional since it doesn't exist in schema
  tags?: string[]; // Optional since it doesn't exist in schema
  respostas: DuvidaResposta[];
  createdAt: string;
  updatedAt: string;
}

export interface DuvidaResposta {
  id: string;
  conteudo: string;
  autorId: string;
  autor: {
    id: string;
    name: string;
    role: string;
  };
  melhorResposta: boolean;
  likes: number;
  createdAt: string;
}

export interface DuvidaStats {
  totalDuvidas: number;
  duvidasPendentes: number;
  duvidasRespondidas: number;
  duvidasFechadas: number;
  tempoMedioResposta: number; // em horas
  minhasRespostas: number;
  melhorResposta: number;
  porDisciplina: {
    disciplina: string;
    quantidade: number;
    pendentes: number;
  }[];
}

export interface DuvidaFilters {
  search?: string;
  disciplinaId?: string;
  status?: "PENDENTE" | "EM_ANALISE" | "RESPONDIDA" | "FECHADA" | "all";
  page?: number;
  limit?: number;
}