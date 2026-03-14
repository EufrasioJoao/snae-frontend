export interface ConteudoBiblioteca {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'LIVRO' | 'MODULO' | 'MATERIAL_COMPLEMENTAR' | 'ARTIGO' | 'VIDEO' | 'EXERCICIO';
  autor: string;
  autorUser?: {
    id: string;
    name: string;
    role: string;
  } | null;
  editora?: string;
  anoPublicacao?: number;
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
  visualizacoes: number;
  tamanhoArquivo?: number | null;
  formatoArquivo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConteudoDetalhado extends ConteudoBiblioteca {
  isbn?: string;
  urlDownload?: string | null;
  conteudoTexto?: string | null;
}

export interface BibliotecaStats {
  totalConteudos: number;
  porTipo: {
    tipo: string;
    count: number;
  }[];
  porDisciplina: {
    disciplina: string;
    nivelEnsino: string;
    count: number;
  }[];
  maisVisualizados: {
    id: string;
    titulo: string;
    tipo: string;
    disciplina: string;
    visualizacoes: number;
  }[];
}

export interface BibliotecaFilters {
  search: string;
  disciplinaId: string;
  tipo: string;
}