"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { 
  Quiz, 
  AvaliacaoStats, 
  AvaliacaoFilters 
} from "./_types/professor-avaliacao.types";
import AvaliacoesHeader from "./_components/AvaliacoesHeader";
import AvaliacoesStats from "./_components/AvaliacoesStats";
import AvaliacoesFilters from "./_components/AvaliacoesFilters";
import AvaliacoesTable from "./_components/AvaliacoesTable";
import CriarQuizModal from "./_components/CriarQuizModal";
import QuizModal from "./_components/QuizModal";

export default function AvaliacoesClient() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<AvaliacaoStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [filters, setFilters] = useState<AvaliacaoFilters>({
    search: "",
    disciplinaId: "all",
    status: "all",
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = useCallback(async (page = 1) => {
    try {
      setRefreshing(true);
      
      const params: any = {
        page,
        limit: filters.limit,
        search: filters.search || undefined,
        disciplinaId: filters.disciplinaId !== "all" ? filters.disciplinaId : undefined
      };

      // Aplicar filtro de status baseado na aba ativa
      if (activeTab === "publicados") {
        params.status = "publicado";
      } else if (activeTab === "rascunhos") {
        params.status = "rascunho";
      }

      const response = await apiRequests.professor.getQuizzes(params);
      
      setQuizzes(response.quizzes);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Erro ao carregar quizzes:", error);
      toast.error("Erro ao carregar quizzes");
    } finally {
      setRefreshing(false);
    }
  }, [filters.limit, filters.search, filters.disciplinaId, activeTab]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await apiRequests.professor.getAvaliacoesStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchQuizzes(1), fetchStats()]);
    setLoading(false);
  }, [fetchQuizzes, fetchStats]);

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchQuizzes(1);
  }, [fetchQuizzes]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = useCallback((page: number) => {
    fetchQuizzes(page);
  }, [fetchQuizzes]);

  const handleFilterChange = useCallback((newFilters: Partial<AvaliacaoFilters>) => {
    setFilters(prev => {
      // Verificar se os filtros realmente mudaram para evitar re-renders desnecessários
      const hasChanged = Object.keys(newFilters).some(key => 
        prev[key as keyof AvaliacaoFilters] !== newFilters[key as keyof AvaliacaoFilters]
      );
      
      if (!hasChanged) {
        return prev;
      }
      
      return { ...prev, ...newFilters };
    });
  }, []);

  const handleCriarQuiz = useCallback(() => {
    setShowCriarModal(true);
  }, []);

  const handleQuizCriado = useCallback(() => {
    setShowCriarModal(false);
    loadData();
    toast.success("Quiz criado com sucesso!");
  }, [loadData]);

  const handleViewQuiz = useCallback((quiz: Quiz) => {
    setSelectedQuiz(quiz);
  }, []);

  const handleEditQuiz = useCallback(() => {
    // TODO: Implementar edição de quiz
    toast.info("Funcionalidade de edição em desenvolvimento");
  }, []);

  const handleDeleteQuiz = useCallback(async (quizId: string) => {
    try {
      await apiRequests.professor.deleteQuiz(quizId);
      toast.success("Quiz excluído com sucesso!");
      loadData();
    } catch (error: any) {
      console.error("Erro ao excluir quiz:", error);
      toast.error(error.response?.data?.error || "Erro ao excluir quiz");
    }
  }, [loadData]);

  const handleTogglePublicacao = useCallback(async (quizId: string, publicado: boolean) => {
    try {
      await apiRequests.professor.toggleQuizPublicacao(quizId, { publicado });
      toast.success(publicado ? "Quiz publicado com sucesso!" : "Quiz despublicado com sucesso!");
      loadData();
    } catch (error: any) {
      console.error("Erro ao alterar publicação:", error);
      toast.error(error.response?.data?.error || "Erro ao alterar publicação");
    }
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AvaliacoesHeader 
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onCriarQuiz={handleCriarQuiz}
      />

      {stats && <AvaliacoesStats stats={stats} />}

      <Card>
        <CardHeader>
          <CardTitle>Meus Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todos">
                Todos ({stats?.totalQuizzes || 0})
              </TabsTrigger>
              <TabsTrigger value="publicados">
                Publicados ({stats?.quizzesPublicados || 0})
              </TabsTrigger>
              <TabsTrigger value="rascunhos">
                Rascunhos ({stats?.quizzesRascunho || 0})
              </TabsTrigger>
            </TabsList>

            <AvaliacoesFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <TabsContent value={activeTab} className="space-y-4">
              <AvaliacoesTable
                quizzes={quizzes}
                loading={refreshing}
                pagination={pagination}
                onPageChange={handlePageChange}
                onView={handleViewQuiz}
                onEdit={handleEditQuiz}
                onDelete={handleDeleteQuiz}
                onTogglePublicacao={handleTogglePublicacao}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showCriarModal && (
        <CriarQuizModal
          open={showCriarModal}
          onClose={() => setShowCriarModal(false)}
          onSuccess={handleQuizCriado}
        />
      )}

      {selectedQuiz && (
        <QuizModal
          quiz={selectedQuiz}
          open={!!selectedQuiz}
          onClose={() => setSelectedQuiz(null)}
          onRefresh={loadData}
        />
      )}
    </div>
  );
}