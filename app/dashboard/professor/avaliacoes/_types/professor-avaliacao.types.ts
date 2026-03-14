export interface Quiz {
  id: string;
  titulo: string;
  descricao?: string;
  disciplinaId: string;
  disciplina: {
    id: string;
    nome: string;
    nivelEnsino: string;
  };
  tempoLimite?: number;
  notaMinima?: number;
  tentativasPermitidas?: number;
  embaralharQuestoes: boolean;
  mostrarResultado: boolean;
  publicado: boolean;
  _count: {
    questoes: number;
    tentativas: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Questao {
  id: string;
  quizId: string;
  enunciado: string;
  tipo: 'MULTIPLA_ESCOLHA' | 'VERDADEIRO_FALSO' | 'DISSERTATIVA';
  dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
  pontos: number;
  ordem: number;
  opcoes?: string; // JSON string
  respostaCorreta?: string; // JSON string
  explicacao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TentativaQuiz {
  id: string;
  quizId: string;
  estudanteId: string;
  estudante: {
    id: string;
    name: string;
    email: string;
  };
  nota?: number;
  notaMaxima: number;
  percentual?: number;
  aprovado?: boolean;
  iniciado: string;
  finalizado?: string;
  tempoGasto?: number;
}

export interface AvaliacaoStats {
  totalQuizzes: number;
  quizzesPublicados: number;
  quizzesRascunho: number;
  totalTentativas: number;
  mediaNotas: number;
  taxaAprovacao: number;
  porDisciplina: Array<{
    disciplinaId: string;
    disciplinaNome: string;
    totalQuizzes: number;
    totalTentativas: number;
    mediaNotas: number;
  }>;
}

export interface AvaliacaoFilters {
  search: string;
  disciplinaId: string;
  status: 'all' | 'publicado' | 'rascunho';
  page: number;
  limit: number;
}

export interface CreateQuizData {
  titulo: string;
  descricao?: string;
  disciplinaId: string;
  tempoLimite?: number;
  notaMinima?: number;
  tentativasPermitidas?: number;
  embaralharQuestoes: boolean;
  mostrarResultado: boolean;
}

export interface CreateQuestaoData {
  enunciado: string;
  tipo: 'MULTIPLA_ESCOLHA' | 'VERDADEIRO_FALSO' | 'DISSERTATIVA';
  dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
  pontos: number;
  opcoes?: Array<{ texto: string; correta: boolean }>;
  explicacao?: string;
}