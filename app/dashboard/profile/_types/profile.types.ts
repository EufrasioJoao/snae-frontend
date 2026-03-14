export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROFESSOR" | "ESTUDANTE";
  emailVerified: boolean;
  finishedOnboarding: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Perfil específico
  perfilEstudante?: {
    id: string;
    nivelEnsino: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
    anoEscolar: number;
    escola?: {
      id: string;
      nome: string;
      tipo: string;
      cidade?: string;
    };
    escolaManual?: string;
  };
  
  perfilProfessor?: {
    id: string;
    especialidade: string;
    escola?: {
      id: string;
      nome: string;
      tipo: string;
      cidade?: string;
    };
    instituicao?: string;
    disciplinas?: {
      id: string;
      disciplina: {
        id: string;
        nome: string;
        nivelEnsino: string;
      };
    }[];
  };
}

export interface UpdateProfileData {
  name: string;
  // Dados específicos do estudante
  nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  anoEscolar?: number;
  escolaId?: string;
  escolaManual?: string;
  // Dados específicos do professor
  especialidade?: string;
  instituicao?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}