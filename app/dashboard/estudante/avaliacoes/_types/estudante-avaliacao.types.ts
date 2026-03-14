export interface QuizDisponivel {
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
  _count: {
    questoes: number;
    tentativas: number;
  };
  minhasTentativas: TentativaEstudante[];
  createdAt: string;
  updatedAt: string;
}

export interface TentativaEstudante {
  id: string;
  quizId: string;
  nota?: number;
  notaMaxima: number;
  percentual?: number;
  aprovado?: boolean;
  iniciado: string;
  finalizado?: string;
  tempoGasto?: number;
}

export interface QuestaoQuiz {
  id: string;
  enunciado: string;
  tipo: 'MULTIPLA_ESCOLHA' | 'VERDADEIRO_FALSO' | 'DISSERTATIVA';
  dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
  pontos: number;
  ordem: number;
  opcoes?: Array<{ texto: string; id: string }>;
}

export interface RespostaEstudante {
  questaoId: string;
  resposta: string | string[];
}

export interface EstudanteAvaliacoesStats {
  totalQuizzes: number;
  quizzesRealizados: number;
  quizzesPendentes: number;
  mediaNotas: number;
  taxaAprovacao: number;
  tempoMedioRealizacao: number;
  porDisciplina: Array<{
    disciplinaId: string;
    disciplinaNome: string;
    totalQuizzes: number;
    realizados: number;
    mediaNotas: number;
  }>;
}

export interface EstudanteAvaliacoesFilters {
  search: string;
  disciplinaId: string; // "all" for all disciplines
  status: 'all' | 'disponivel' | 'realizado' | 'pendente';
  dificuldade: 'all' | 'FACIL' | 'MEDIO' | 'DIFICIL';
}