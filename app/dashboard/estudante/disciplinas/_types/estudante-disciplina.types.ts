export interface EstudanteDisciplina {
  id: string;
  estudanteId: string;
  disciplinaId: string;
  dataAssociacao: string;
  disciplina: {
    id: string;
    nome: string;
    descricao?: string;
    nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
    areaConhecimento: {
      id: string;
      nome: string;
    };
  };
}

export interface EstudanteDisciplinasStats {
  total: number;
  primario: number;
  secundario: number;
  porArea: {
    area: string;
    count: number;
  }[];
}

export interface DisciplinaDisponivel {
  id: string;
  nome: string;
  descricao?: string;
  nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  areaConhecimento: {
    id: string;
    nome: string;
  };
  jaAssociada?: boolean;
}