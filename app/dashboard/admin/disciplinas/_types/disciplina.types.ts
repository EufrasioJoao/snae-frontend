export interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  areaConhecimentoId: string;
  areaConhecimento: {
    id: string;
    nome: string;
  };
  professores?: {
    id: string;
    user: {
      name: string;
      email: string;
    };
  }[];
  _count?: {
    professores: number;
    conteudos: number;
    duvidas: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AreaConhecimento {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  disciplinas?: Disciplina[];
  createdAt: string;
  updatedAt: string;
}

export interface DisciplinaStats {
  total: number;
  primario: number;
  secundario: number;
  areasConhecimento: number;
  professoresAssociados: number;
  conteudosTotal: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DisciplinasResponse {
  success: boolean;
  disciplinas: Disciplina[];
  pagination: PaginationInfo;
}

export interface CreateDisciplinaData {
  nome: string;
  descricao?: string;
  nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  areaConhecimentoId: string;
}

export interface UpdateDisciplinaData extends CreateDisciplinaData {
  id: string;
}