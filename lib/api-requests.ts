import api from "./api";


const apiRequests = {
  user: {
    getById: async (id: string) => {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/users/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    },
    getAll: async (params?: {
      page?: number;
      limit?: number;
      role?: string;
      search?: string;
    }) => {
      const response = await api.get("/api/users", { params });
      return response.data;
    },
    getStats: async () => {
      const response = await api.get("/api/users/stats");
      return response.data;
    },
    create: async (data: {
      name: string;
      email: string;
      role: string;
      emailVerified?: boolean;
    }) => {
      const response = await api.post("/api/users", data);
      return response.data;
    },
    onboarding: async (userId: string, data: {
      role: "ESTUDANTE" | "PROFESSOR";
      nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
      anoEscolar?: number;
      escolaId?: string;
      escolaManual?: string;
      especialidade?: string;
      instituicao?: string;
      disciplinaIds?: string[];
    }) => {
      const response = await api.post(`/api/users/${userId}/onboarding`, data);
      return response.data;
    },
    
    getProfile: async () => {
      const response = await api.get("/api/users/profile/me");
      return response.data;
    },
    
    updateProfile: async (data: {
      name: string;
      nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
      anoEscolar?: number;
      escolaId?: string;
      escolaManual?: string;
      especialidade?: string;
      instituicao?: string;
    }) => {
      const response = await api.put("/api/users/profile/me", data);
      return response.data;
    },
    
    changePassword: async (data: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => {
      const response = await api.put("/api/users/profile/change-password", data);
      return response.data;
    },
  },

  escola: {
    getProvincias: async () => {
      const response = await api.get("/api/escolas/provincias");
      return response.data;
    },
    getDistritos: async (provinciaId: string) => {
      const response = await api.get(`/api/escolas/provincias/${provinciaId}/distritos`);
      return response.data;
    },
    search: async (params: {
      search?: string;
      provinciaId?: string;
      distritoId?: string;
      tipo?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get("/api/escolas", { params });
      return response.data;
    },
  },

  disciplina: {
    getAll: async (params?: any) => {
      const response = await api.get("/api/disciplinas", { params });
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get(`/api/disciplinas/${id}`);
      return response.data;
    },
    
    create: async (data: any) => {
      const response = await api.post("/api/disciplinas", data);
      return response.data;
    },
    
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/disciplinas/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      const response = await api.delete(`/api/disciplinas/${id}`);
      return response.data;
    },
    
    getStats: async () => {
      const response = await api.get("/api/disciplinas/stats");
      return response.data;
    },
    
    getAreas: async () => {
      const response = await api.get("/api/areas-conhecimento");
      return response.data;
    },
    
    createArea: async (data: any) => {
      const response = await api.post("/api/areas-conhecimento", data);
      return response.data;
    },
  },

  conteudo: {
    getAll: async (params?: {
      search?: string;
      tipo?: string;
      disciplinaId?: string;
      status?: string;
      autorId?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get("/api/conteudos", { params });
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get(`/api/conteudos/${id}`);
      return response.data;
    },
    
    create: async (data: any) => {
      const response = await api.post("/api/conteudos", data);
      return response.data;
    },
    
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/conteudos/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      const response = await api.delete(`/api/conteudos/${id}`);
      return response.data;
    },
    
    approve: async (id: string) => {
      const response = await api.post(`/api/conteudos/${id}/approve`);
      return response.data;
    },
    
    reject: async (id: string) => {
      const response = await api.post(`/api/conteudos/${id}/reject`);
      return response.data;
    },
    
    getStats: async () => {
      const response = await api.get("/api/conteudos/stats");
      return response.data;
    },
  },

  relatorios: {
    getGeral: async (filtros?: any) => {
      const response = await api.get("/api/relatorios/geral", { params: filtros });
      return response.data;
    },
    
    getUsuarios: async (filtros?: any) => {
      const response = await api.get("/api/relatorios/usuarios", { params: filtros });
      return response.data;
    },
    
    getConteudos: async (filtros?: any) => {
      const response = await api.get("/api/relatorios/conteudos", { params: filtros });
      return response.data;
    },
    
    getDuvidas: async (filtros?: any) => {
      const response = await api.get("/api/relatorios/duvidas", { params: filtros });
      return response.data;
    },
    
    getAvaliacoes: async (filtros?: any) => {
      const response = await api.get("/api/relatorios/avaliacoes", { params: filtros });
      return response.data;
    },
    
    exportPDF: async (tipo: string, filtros?: any) => {
      const response = await api.get(`/api/relatorios/${tipo}/export/pdf`, { 
        params: filtros,
        responseType: 'blob'
      });
      return response.data;
    },
    
    exportExcel: async (tipo: string, filtros?: any) => {
      const response = await api.get(`/api/relatorios/${tipo}/export/excel`, { 
        params: filtros,
        responseType: 'blob'
      });
      return response.data;
    },
  },

  duvida: {
    getAll: async (params?: any) => {
      const response = await api.get("/api/duvidas", { params });
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get(`/api/duvidas/${id}`);
      return response.data;
    },
    
    create: async (data: any) => {
      const response = await api.post("/api/duvidas", data);
      return response.data;
    },
    
    respond: async (id: string, data: any) => {
      const response = await api.post(`/api/duvidas/${id}/respostas`, data);
      return response.data;
    },
  },

  quiz: {
    getAll: async (params?: any) => {
      const response = await api.get("/api/quizzes", { params });
      return response.data;
    },
    
    getById: async (id: string) => {
      const response = await api.get(`/api/quizzes/${id}`);
      return response.data;
    },
    
    create: async (data: any) => {
      const response = await api.post("/api/quizzes", data);
      return response.data;
    },
    
    submit: async (id: string, respostas: any) => {
      const response = await api.post(`/api/quizzes/${id}/submit`, { respostas });
      return response.data;
    },
  },

  professor: {
    getDisciplinas: async (params?: {
      search?: string;
      nivelEnsino?: string;
      areaId?: string;
    }) => {
      const response = await api.get("/api/professor/disciplinas", { params });
      return response.data;
    },
    
    getDisciplinasStats: async () => {
      const response = await api.get("/api/professor/disciplinas/stats");
      return response.data;
    },
    
    getDuvidas: async (params?: {
      search?: string;
      disciplinaId?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get("/api/professor/duvidas", { params });
      return response.data;
    },
    
    getDuvidasStats: async () => {
      const response = await api.get("/api/professor/duvidas/stats");
      return response.data;
    },
    
    responderDuvida: async (duvidaId: string, data: { conteudo: string }) => {
      const response = await api.post(`/api/professor/duvidas/${duvidaId}/responder`, data);
      return response.data;
    },
    
    getConteudos: async (params?: {
      search?: string;
      tipo?: string;
      disciplinaId?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get("/api/professor/conteudos", { params });
      return response.data;
    },
    
    getConteudosStats: async () => {
      const response = await api.get("/api/professor/conteudos/stats");
      return response.data;
    },
    
    createConteudo: async (data: any) => {
      const response = await api.post("/api/professor/conteudos", data);
      return response.data;
    },
    
    associateDisciplinas: async (data: { disciplinaIds: string[] }) => {
      const response = await api.post("/api/professor/disciplinas/associate", data);
      return response.data;
    },

    // Quizzes/Avaliações
    getQuizzes: async (params?: {
      search?: string;
      disciplinaId?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const response = await api.get("/api/professor/quizzes", { params });
      return response.data;
    },

    getAvaliacoesStats: async () => {
      const response = await api.get("/api/professor/quizzes/stats");
      return response.data;
    },

    createQuiz: async (data: {
      titulo: string;
      descricao?: string;
      disciplinaId: string;
      tempoLimite?: number;
      notaMinima?: number;
      tentativasPermitidas?: number;
      embaralharQuestoes: boolean;
      mostrarResultado: boolean;
    }) => {
      const response = await api.post("/api/professor/quizzes", data);
      return response.data;
    },

    deleteQuiz: async (quizId: string) => {
      const response = await api.delete(`/api/professor/quizzes/${quizId}`);
      return response.data;
    },

    toggleQuizPublicacao: async (quizId: string, data: { publicado: boolean }) => {
      const response = await api.patch(`/api/professor/quizzes/${quizId}/publicacao`, data);
      return response.data;
    },

    getQuestoesByQuiz: async (quizId: string) => {
      const response = await api.get(`/api/professor/quizzes/${quizId}/questoes`);
      return response.data;
    },

    getTentativasByQuiz: async (quizId: string) => {
      const response = await api.get(`/api/professor/quizzes/${quizId}/tentativas`);
      return response.data;
    },

    createQuestao: async (quizId: string, data: {
      enunciado: string;
      tipo: 'MULTIPLA_ESCOLHA' | 'VERDADEIRO_FALSO' | 'DISSERTATIVA';
      dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
      pontos: number;
      opcoes?: Array<{ texto: string; correta: boolean }>;
      explicacao?: string;
    }) => {
      const response = await api.post(`/api/professor/quizzes/${quizId}/questoes`, data);
      return response.data;
    },
  },

  estudante: {
    getDisciplinas: async () => {
      const response = await api.get("/api/estudante/disciplinas");
      return response.data;
    },
    
    getDisciplinasStats: async () => {
      const response = await api.get("/api/estudante/disciplinas/stats");
      return response.data;
    },
    
    getDisciplinasDisponiveis: async () => {
      const response = await api.get("/api/estudante/disciplinas/disponiveis");
      return response.data;
    },
    
    associarDisciplinas: async (disciplinaIds: string[]) => {
      const response = await api.post("/api/estudante/disciplinas/associar", { disciplinaIds });
      return response.data;
    },
    
    desassociarDisciplina: async (disciplinaId: string) => {
      const response = await api.delete(`/api/estudante/disciplinas/${disciplinaId}`);
      return response.data;
    },
    
    // Dúvidas
    getDuvidas: async (params?: {
      page?: number;
      limit?: number;
      status?: string;
      disciplinaId?: string;
      search?: string;
    }) => {
      const response = await api.get("/api/estudante/duvidas", { params });
      return response.data;
    },
    
    getDuvidasStats: async () => {
      const response = await api.get("/api/estudante/duvidas/stats");
      return response.data;
    },
    
    createDuvida: async (data: {
      titulo: string;
      descricao: string;
      disciplinaId: string;
      topicoId?: string;
    }) => {
      const response = await api.post("/api/estudante/duvidas", data);
      return response.data;
    },
    
    getDuvidaById: async (id: string) => {
      const response = await api.get(`/api/estudante/duvidas/${id}`);
      return response.data;
    },
    
    getTopicosByDisciplina: async (disciplinaId: string) => {
      const response = await api.get(`/api/estudante/disciplinas/${disciplinaId}/topicos`);
      return response.data;
    },
    
    // Biblioteca
    getBiblioteca: async (params?: {
      page?: number;
      limit?: number;
      disciplinaId?: string;
      tipo?: string;
      search?: string;
    }) => {
      const response = await api.get("/api/estudante/biblioteca", { params });
      return response.data;
    },
    
    getBibliotecaStats: async () => {
      const response = await api.get("/api/estudante/biblioteca/stats");
      return response.data;
    },
    
    getConteudoDetalhes: async (id: string) => {
      const response = await api.get(`/api/estudante/biblioteca/conteudo/${id}`);
      return response.data;
    },
    
    // Quizzes/Avaliações
    getQuizzes: async (params?: {
      page?: number;
      limit?: number;
      disciplinaId?: string;
      status?: string;
      search?: string;
      dificuldade?: string;
    }) => {
      const response = await api.get("/api/estudante/quizzes", { params });
      return response.data;
    },
    
    getQuizzesStats: async () => {
      const response = await api.get("/api/estudante/quizzes/stats");
      return response.data;
    },
    
    getQuizById: async (id: string) => {
      const response = await api.get(`/api/estudante/quizzes/${id}`);
      return response.data;
    },
    
    iniciarQuiz: async (id: string) => {
      const response = await api.post(`/api/estudante/quizzes/${id}/iniciar`);
      return response.data;
    },
    
    submeterQuiz: async (id: string, respostas: any[]) => {
      const response = await api.post(`/api/estudante/quizzes/${id}/submeter`, { respostas });
      return response.data;
    },
    
    getResultadosQuiz: async (id: string) => {
      const response = await api.get(`/api/estudante/quizzes/${id}/resultados`);
      return response.data;
    },
    
    getTentativasQuiz: async (id: string) => {
      const response = await api.get(`/api/estudante/quizzes/${id}/tentativas`);
      return response.data;
    },
    
    // Progresso
    getProgressoGeral: async () => {
      const response = await api.get("/api/estudante/progresso/geral");
      return response.data;
    },
    
    getProgressoDisciplinas: async () => {
      const response = await api.get("/api/estudante/progresso/disciplinas");
      return response.data;
    },
    
    getAtividadesRecentes: async (params?: {
      limit?: number;
      tipo?: string;
    }) => {
      const response = await api.get("/api/estudante/progresso/atividades", { params });
      return response.data;
    },
    
    getConquistas: async () => {
      const response = await api.get("/api/estudante/progresso/conquistas");
      return response.data;
    },
    
    getEstatisticasTempo: async (periodo?: string) => {
      const response = await api.get("/api/estudante/progresso/tempo", { 
        params: { periodo } 
      });
      return response.data;
    },
    
    // Assistente IA
    chatAssistente: async (data: {
      disciplinaId: string;
      mensagem: string;
      historico?: Array<{ role: string; content: string }>;
    }) => {
      const response = await api.post("/api/estudante/assistente/chat", data);
      return response.data;
    },
  },

};

export default apiRequests;
