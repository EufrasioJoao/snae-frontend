export interface ProgressoGeral {
  totalDisciplinas: number;
  disciplinasAtivas: number;
  totalQuizzes: number;
  quizzesRealizados: number;
  mediaGeral: number;
  taxaAprovacao: number;
  tempoTotalEstudo: number; // em minutos
  sequenciaAtual: number; // dias consecutivos
  melhorSequencia: number;
  pontosTotal: number;
  nivel: number;
  proximoNivel: number;
}

export interface ProgressoDisciplina {
  disciplinaId: string;
  disciplinaNome: string;
  nivelEnsino: string;
  areaConhecimento: string;
  totalQuizzes: number;
  quizzesRealizados: number;
  mediaNotas: number;
  ultimaAtividade: string;
  progresso: number; // percentual 0-100
  tempoEstudo: number; // em minutos
  conquistas: string[];
}

export interface AtividadeRecente {
  id: string;
  tipo: 'QUIZ' | 'DUVIDA' | 'CONTEUDO';
  titulo: string;
  disciplina: string;
  data: string;
  resultado?: {
    nota?: number;
    aprovado?: boolean;
    tempo?: number;
  };
}

export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  categoria: 'QUIZ' | 'ESTUDO' | 'DISCIPLINA' | 'GERAL';
  desbloqueada: boolean;
  dataDesbloqueio?: string;
  progresso?: number; // 0-100 para conquistas em progresso
  meta?: number;
}

export interface EstatisticasTempo {
  hoje: number;
  semana: number;
  mes: number;
  total: number;
  mediaDiaria: number;
  diasAtivos: number;
  melhorDia: {
    data: string;
    tempo: number;
  };
}

export interface GraficoProgresso {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface MetasEstudante {
  tempoSemanal: number; // meta em minutos
  quizzesSemana: number;
  notaMinima: number;
  disciplinasAtivas: number;
}

export interface ProgressoFilters {
  periodo: 'semana' | 'mes' | 'trimestre' | 'ano';
  disciplinaId: string; // 'all' para todas
  tipo: 'all' | 'quizzes' | 'tempo' | 'notas';
}