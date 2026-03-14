export interface RelatorioGeral {
  usuarios: {
    total: number;
    estudantes: number;
    professores: number;
    admins: number;
    novosUltimos30Dias: number;
    ativosUltimos7Dias: number;
  };
  conteudos: {
    total: number;
    aprovados: number;
    pendentes: number;
    rejeitados: number;
    totalVisualizacoes: number;
    totalDownloads: number;
    maisAcessados: {
      titulo: string;
      visualizacoes: number;
      downloads: number;
    }[];
  };
  atividade: {
    duvidasCriadas: number;
    respostasEnviadas: number;
    quizzesRealizados: number;
    tempoMedioResposta: number; // em horas
  };
  disciplinas: {
    total: number;
    maisPopulares: {
      nome: string;
      estudantes: number;
      conteudos: number;
    }[];
  };
}

export interface RelatorioUsuarios {
  registrosPorMes: {
    mes: string;
    estudantes: number;
    professores: number;
    total: number;
  }[];
  atividadePorDia: {
    data: string;
    usuariosAtivos: number;
    novosCadastros: number;
  }[];
  distribuicaoPorProvincia: {
    provincia: string;
    estudantes: number;
    professores: number;
    total: number;
  }[];
  retencao: {
    dia1: number;
    dia7: number;
    dia30: number;
  };
}

export interface RelatorioConteudos {
  criacaoPorMes: {
    mes: string;
    criados: number;
    aprovados: number;
    rejeitados: number;
  }[];
  porTipo: {
    tipo: string;
    quantidade: number;
    visualizacoes: number;
    downloads: number;
  }[];
  porDisciplina: {
    disciplina: string;
    quantidade: number;
    visualizacoes: number;
    downloads: number;
  }[];
  tempoMedioAprovacao: number; // em horas
  maisPopulares: {
    titulo: string;
    tipo: string;
    disciplina: string;
    visualizacoes: number;
    downloads: number;
    autor: string;
  }[];
}

export interface RelatorioDuvidas {
  criadasPorMes: {
    mes: string;
    criadas: number;
    respondidas: number;
  }[];
  porDisciplina: {
    disciplina: string;
    quantidade: number;
    tempoMedioResposta: number;
  }[];
  porStatus: {
    status: string;
    quantidade: number;
    percentual: number;
  }[];
  professoresMaisAtivos: {
    nome: string;
    respostas: number;
    melhorResposta: number;
    tempoMedioResposta: number;
  }[];
}

export interface RelatorioAvaliacoes {
  quizzesPorMes: {
    mes: string;
    criados: number;
    realizados: number;
  }[];
  desempenhoPorDisciplina: {
    disciplina: string;
    tentativas: number;
    mediaNotas: number;
    taxaAprovacao: number;
  }[];
  dificuldadeQuestoes: {
    dificuldade: string;
    quantidade: number;
    taxaAcerto: number;
  }[];
  estudantesMaisAtivos: {
    nome: string;
    tentativas: number;
    mediaNotas: number;
    melhorNota: number;
  }[];
}

export interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  disciplinaId?: string;
  provinciaId?: string;
  nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO" | "all";
  tipoUsuario?: "ESTUDANTE" | "PROFESSOR" | "ADMIN" | "all";
}