export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  finishedOnboarding: boolean;
  createdAt: string;
  perfilEstudante?: {
    nivelEnsino: string;
    anoEscolar: number;
    escola?: {
      nome: string;
    };
    escolaManual?: string;
  };
  perfilProfessor?: {
    especialidade: string;
    escola?: {
      nome: string;
    };
    instituicao?: string;
  };
}

export interface UserStats {
  total: number;
  estudantes: number;
  professores: number;
  admins: number;
  pendingOnboarding: number;
  unverifiedEmails: number;
  activeUsers: number;
  verifiedUsers: number;
}

export interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}