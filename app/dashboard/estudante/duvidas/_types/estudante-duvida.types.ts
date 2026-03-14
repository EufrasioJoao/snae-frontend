export interface EstudanteDuvida {
  id: string;
  titulo: string;
  descricao: string;
  status: 'PENDENTE' | 'EM_ANALISE' | 'RESPONDIDA' | 'FECHADA';
  disciplina: {
    id: string;
    nome: string;
    nivelEnsino: 'ENSINO_PRIMARIO' | 'ENSINO_SECUNDARIO';
    areaConhecimento: string;
  };
  topico?: {
    id: string;
    nome: string;
  } | null;
  totalRespostas: number;
  ultimaResposta?: {
    id: string;
    conteudo: string;
    autor: {
      id: string;
      name: string;
      role: string;
    };
    createdAt: string;
  } | null;
  temRespostaProfessor: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EstudanteDuvidasStats {
  total: number;
  pendentes: number;
  respondidas: number;
  fechadas: number;
  porDisciplina: {
    disciplina: string;
    nivelEnsino: string;
    count: number;
  }[];
}

export interface EstudanteDuvidasFilters {
  search: string;
  status: string;
  disciplinaId: string;
}

export interface DuvidaDetalhada extends EstudanteDuvida {
  estudante: {
    id: string;
    name: string;
  };
  respostas: {
    id: string;
    conteudo: string;
    tipo: 'PROFESSOR' | 'ESTUDANTE' | 'SISTEMA';
    melhorResposta: boolean;
    likes: number;
    autor: {
      id: string;
      name: string;
      role: string;
    };
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface CreateDuvidaData {
  titulo: string;
  descricao: string;
  disciplinaId: string;
  topicoId?: string;
}

export interface Topico {
  id: string;
  nome: string;
  descricao?: string;
  ordem: number;
}