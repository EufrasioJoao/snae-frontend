export interface ConteudoEducacional {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: "LIVRO" | "MODULO" | "MATERIAL_COMPLEMENTAR" | "ARTIGO" | "VIDEO" | "EXERCICIO";
  conteudoTexto?: string;
  urlArquivo?: string;
  presignedUrl?: string;
  disciplinaId: string;
  disciplina: {
    id: string;
    nome: string;
    nivelEnsino: string;
    areaConhecimento: {
      nome: string;
    };
  };
  topicoId?: string;
  topico?: {
    id: string;
    nome: string;
  };
  autor?: string;
  editora?: string;
  anoPublicacao?: number;
  isbn?: string;
  publicado: boolean;
  visualizacoes: number;
  ordem: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConteudoStats {
  total: number;
  aprovados: number;
  pendentes: number;
  rejeitados: number;
  totalVisualizacoes: number;
  totalDownloads: number;
  porTipo: {
    [key: string]: number;
  };
  porDisciplina: {
    disciplina: string;
    count: number;
  }[];
  maisAcessados: {
    titulo: string;
    visualizacoes: number;
    downloads: number;
  }[];
}

export interface ConteudoFilters {
  search?: string;
  tipo?: string;
  disciplinaId?: string;
  status?: "publicado" | "pendente" | "all";
  page?: number;
  limit?: number;
}