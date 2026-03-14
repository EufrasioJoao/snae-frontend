// ============================================
// SNAE - Sistema Nacional de Aprendizagem ao Estudante
// ENUMS E TIPOS
// ============================================

// ============================================
// ENUMS
// ============================================

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  ESTUDANTE = "ESTUDANTE",
  PROFESSOR = "PROFESSOR",
}

export enum NivelEnsino {
  ENSINO_PRIMARIO = "ENSINO_PRIMARIO",           // 1ª a 7ª classe
  ENSINO_SECUNDARIO = "ENSINO_SECUNDARIO",       // 8ª a 12ª classe
}

export enum TipoConteudo {
  LIVRO = "LIVRO",
  MODULO = "MODULO",
  MATERIAL_COMPLEMENTAR = "MATERIAL_COMPLEMENTAR",
  ARTIGO = "ARTIGO",
  VIDEO = "VIDEO",
  EXERCICIO = "EXERCICIO",
}

export enum StatusDuvida {
  PENDENTE = "PENDENTE",
  EM_ANALISE = "EM_ANALISE",
  RESPONDIDA = "RESPONDIDA",
  FECHADA = "FECHADA",
}

export enum TipoResposta {
  PROFESSOR = "PROFESSOR",
  ESTUDANTE = "ESTUDANTE",
  SISTEMA = "SISTEMA",
}

export enum DificuldadeQuestao {
  FACIL = "FACIL",
  MEDIO = "MEDIO",
  DIFICIL = "DIFICIL",
}

// ============================================
// INTERFACES - PERFIS
// ============================================

export interface PerfilEstudante {
  id: string;
  userId: string;
  nivelEnsino: NivelEnsino;
  anoEscolar: number;
  escola?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerfilProfessor {
  id: string;
  userId: string;
  especialidade: string;
  instituicao?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INTERFACES - CONTEÚDO EDUCACIONAL
// ============================================

export interface AreaConhecimento {
  id: string;
  nome: string;
  descricao?: string;
  icone?: string;
  cor?: string;
  ordem: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  codigo?: string;
  nivelEnsino: NivelEnsino;
  areaConhecimentoId: string;
  areaConhecimento?: AreaConhecimento;
  icone?: string;
  cor?: string;
  ordem: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topico {
  id: string;
  nome: string;
  descricao?: string;
  disciplinaId: string;
  disciplina?: Disciplina;
  ordem: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConteudoEducacional {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoConteudo;
  disciplinaId: string;
  disciplina?: Disciplina;
  topicoId?: string;
  topico?: Topico;
  autor?: string;
  editora?: string;
  anoPublicacao?: number;
  isbn?: string;
  urlArquivo?: string;
  tamanhoArquivo?: number;
  formatoArquivo?: string;
  conteudoTexto?: string;
  publicado: boolean;
  ordem: number;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INTERFACES - DÚVIDAS E RESPOSTAS
// ============================================

export interface Duvida {
  id: string;
  titulo: string;
  descricao: string;
  disciplinaId: string;
  disciplina?: Disciplina;
  topicoId?: string;
  topico?: Topico;
  estudanteId: string;
  estudante?: User;
  status: StatusDuvida;
  anexos?: string; // JSON array de URLs
  respostas?: Resposta[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Resposta {
  id: string;
  conteudo: string;
  duvidaId: string;
  duvida?: Duvida;
  autorId: string;
  autor?: User;
  tipo: TipoResposta;
  melhorResposta: boolean;
  likes: number;
  anexos?: string; // JSON array de URLs
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INTERFACES - AVALIAÇÕES
// ============================================

export interface Quiz {
  id: string;
  titulo: string;
  descricao?: string;
  disciplinaId: string;
  disciplina?: Disciplina;
  tempoLimite?: number; // em minutos
  notaMinima?: number;
  tentativasPermitidas?: number;
  embaralharQuestoes: boolean;
  mostrarResultado: boolean;
  publicado: boolean;
  questoes?: Questao[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Questao {
  id: string;
  quizId: string;
  quiz?: Quiz;
  enunciado: string;
  tipo: string; // MULTIPLA_ESCOLHA, VERDADEIRO_FALSO, DISSERTATIVA
  dificuldade: DificuldadeQuestao;
  pontos: number;
  ordem: number;
  opcoes?: string; // JSON array
  respostaCorreta?: string; // JSON
  explicacao?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TentativaQuiz {
  id: string;
  quizId: string;
  quiz?: Quiz;
  estudanteId: string;
  estudante?: User;
  nota?: number;
  notaMaxima: number;
  percentual?: number;
  aprovado?: boolean;
  iniciado: Date;
  finalizado?: Date;
  tempoGasto?: number; // em segundos
  respostas?: RespostaQuestao[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RespostaQuestao {
  id: string;
  tentativaId: string;
  tentativa?: TentativaQuiz;
  questaoId: string;
  questao?: Questao;
  resposta: string; // JSON
  correta?: boolean;
  pontos: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INTERFACES - PROGRESSO E OFFLINE
// ============================================

export interface ProgressoEstudante {
  id: string;
  estudanteId: string;
  estudante?: User;
  disciplinaId: string;
  disciplina?: Disciplina;
  conteudoId?: string;
  conteudo?: ConteudoEducacional;
  percentualConclusao: number;
  tempoEstudo: number; // em minutos
  ultimoAcesso: Date;
  concluido: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AcessoOffline {
  id: string;
  estudanteId: string;
  estudante?: User;
  conteudoId: string;
  conteudo?: ConteudoEducacional;
  baixadoEm: Date;
  ultimoAcesso: Date;
  expiracao?: Date;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INTERFACES - NOTIFICAÇÕES E LOGS
// ============================================

export interface Notificacao {
  id: string;
  userId: string;
  user?: User;
  titulo: string;
  mensagem: string;
  tipo: string; // DUVIDA, RESPOSTA, QUIZ, SISTEMA
  referenciaId?: string;
  referenciaUrl?: string;
  lida: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogAtividade {
  id: string;
  userId?: string;
  acao: string;
  entidade?: string;
  entidadeId?: string;
  detalhes?: string; // JSON
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================
// INTERFACES - USUÁRIO
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  bio?: string;
  finishedOnboarding: boolean;
  perfilEstudante?: PerfilEstudante;
  perfilProfessor?: PerfilProfessor;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// TIPOS AUXILIARES
// ============================================

export type CreateDuvidaInput = {
  titulo: string;
  descricao: string;
  disciplinaId: string;
  topicoId?: string;
  anexos?: string[];
};

export type CreateRespostaInput = {
  conteudo: string;
  duvidaId: string;
  anexos?: string[];
};

export type CreateQuizInput = {
  titulo: string;
  descricao?: string;
  disciplinaId: string;
  tempoLimite?: number;
  notaMinima?: number;
  tentativasPermitidas?: number;
  embaralharQuestoes?: boolean;
  mostrarResultado?: boolean;
};

export type CreateQuestaoInput = {
  quizId: string;
  enunciado: string;
  tipo: string;
  dificuldade: DificuldadeQuestao;
  pontos: number;
  ordem: number;
  opcoes?: any[];
  respostaCorreta?: any;
  explicacao?: string;
};

export type UpdateProgressoInput = {
  estudanteId: string;
  disciplinaId: string;
  conteudoId?: string;
  percentualConclusao: number;
  tempoEstudo: number;
  concluido?: boolean;
};

// ============================================
// TIPOS DE FILTROS E PAGINAÇÃO
// ============================================

export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type DisciplinaFilters = {
  nivelEnsino?: NivelEnsino;
  areaConhecimentoId?: string;
  search?: string;
} & PaginationParams;

export type ConteudoFilters = {
  disciplinaId?: string;
  topicoId?: string;
  tipo?: TipoConteudo;
  publicado?: boolean;
  search?: string;
} & PaginationParams;

export type DuvidaFilters = {
  disciplinaId?: string;
  topicoId?: string;
  status?: StatusDuvida;
  estudanteId?: string;
  search?: string;
} & PaginationParams;

export type QuizFilters = {
  disciplinaId?: string;
  publicado?: boolean;
  search?: string;
} & PaginationParams;
