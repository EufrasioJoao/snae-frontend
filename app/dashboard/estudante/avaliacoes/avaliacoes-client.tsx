"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  BookOpen,
  Calendar,
  Play,
  Eye,
  Search,
  Filter,
  BarChart3,
  Trophy,
  Target,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { 
  QuizDisponivel, 
  EstudanteAvaliacoesStats, 
  EstudanteAvaliacoesFilters 
} from "./_types/estudante-avaliacao.types";
import RealizarQuizModal from "./_components/RealizarQuizModal";

export default function AvaliacoesClient() {
  const [quizzes, setQuizzes] = useState<QuizDisponivel[]>([]);
  const [stats, setStats] = useState<EstudanteAvaliacoesStats | null>(null);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRealizarQuiz, setShowRealizarQuiz] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [filters, setFilters] = useState<EstudanteAvaliacoesFilters>({
    search: "",
    disciplinaId: "all",
    status: "all",
    dificuldade: "all"
  });

  useEffect(() => {
    fetchData();
  }, []); // Remove filters dependency to prevent auto-refresh

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [quizzesData, statsData, disciplinasResponse] = await Promise.all([
        apiRequests.estudante.getQuizzes(filters),
        apiRequests.estudante.getQuizzesStats(),
        apiRequests.estudante.getDisciplinas()
      ]);
      
      // Handle quizzes response - pode ser array direto ou objeto com propriedade quizzes
      const quizzesArray = Array.isArray(quizzesData) 
        ? quizzesData 
        : (quizzesData?.quizzes || []);
      
      setQuizzes(quizzesArray);
      setStats(statsData || null);
      
      // Handle disciplinas response structure
      const disciplinasArray = disciplinasResponse?.disciplinas || [];
      const disciplinasFormatted = disciplinasArray.map((item: any) => ({
        id: item.disciplina.id,
        nome: item.disciplina.nome,
        nivelEnsino: item.disciplina.nivelEnsino,
        areaConhecimento: item.disciplina.areaConhecimento
      }));
      
      setDisciplinas(disciplinasFormatted);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar avaliações");
      // Set default values on error
      setQuizzes([]);
      setStats(null);
      setDisciplinas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof EstudanteAvaliacoesFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const getStatusBadge = (quiz: QuizDisponivel) => {
    const tentativas = quiz.minhasTentativas || [];
    
    if (tentativas.length === 0) {
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Play className="h-3 w-3 mr-1" />
          Disponível
        </Badge>
      );
    }
    
    const ultimaTentativa = tentativas[tentativas.length - 1];
    
    if (!ultimaTentativa.finalizado) {
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Em andamento
        </Badge>
      );
    }
    
    if (ultimaTentativa.aprovado) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <Target className="h-3 w-3 mr-1" />
        Reprovado
      </Badge>
    );
  };

  const formatNivelEnsino = (nivel: string) => {
    switch (nivel) {
      case "ENSINO_PRIMARIO":
        return "Ensino Primário";
      case "ENSINO_SECUNDARIO":
        return "Ensino Secundário";
      default:
        return nivel;
    }
  };

  const handleIniciarQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    setShowRealizarQuiz(true);
  };

  const handleVerResultados = (quizId: string) => {
    toast.info("Funcionalidade de ver resultados em desenvolvimento");
  };

  const handleQuizSuccess = () => {
    fetchData(); // Refresh data after quiz completion
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
        <p className="text-gray-600">Realize quizzes e acompanhe seu desempenho</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Quizzes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.quizzesPendentes} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Realizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quizzesRealizados}</div>
              <p className="text-xs text-muted-foreground">
                {((stats.quizzesRealizados / stats.totalQuizzes) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Notas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediaNotas.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                De 0 a 20 pontos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taxaAprovacao.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Quizzes aprovados
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Disciplina</label>
              <Select
                value={filters.disciplinaId}
                onValueChange={(value) => handleFilterChange("disciplinaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as disciplinas</SelectItem>
                  {Array.isArray(disciplinas) && disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="realizado">Realizado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes List */}
      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma avaliação encontrada
              </h3>
              <p className="text-gray-500">
                Não há quizzes disponíveis com os filtros selecionados.
              </p>
            </CardContent>
          </Card>
        ) : (
          quizzes.map((quiz) => {
            const tentativas = quiz.minhasTentativas || [];
            const ultimaTentativa = tentativas[tentativas.length - 1];
            
            return (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {quiz.titulo}
                        </h3>
                        {getStatusBadge(quiz)}
                      </div>
                      
                      {quiz.descricao && (
                        <p className="text-gray-600 mb-3">{quiz.descricao}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{quiz.disciplina.nome}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{quiz._count.questoes} questões</span>
                        </div>
                        
                        {quiz.tempoLimite && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{quiz.tempoLimite} min</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(quiz.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {ultimaTentativa && ultimaTentativa.finalizado && (
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {ultimaTentativa.nota?.toFixed(1)}/{ultimaTentativa.notaMaxima}
                          </p>
                          <p className="text-sm text-gray-500">
                            {ultimaTentativa.percentual?.toFixed(1)}%
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        {tentativas.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerResultados(quiz.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Resultados
                          </Button>
                        )}
                        
                        {(!ultimaTentativa || 
                          (quiz.tentativasPermitidas && tentativas.length < quiz.tentativasPermitidas) ||
                          !quiz.tentativasPermitidas) && (
                          <Button
                            size="sm"
                            onClick={() => handleIniciarQuiz(quiz.id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {tentativas.length > 0 ? "Tentar Novamente" : "Iniciar Quiz"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {tentativas.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          Tentativas: {tentativas.length}
                          {quiz.tentativasPermitidas && ` / ${quiz.tentativasPermitidas}`}
                        </span>
                        
                        {ultimaTentativa && ultimaTentativa.finalizado && (
                          <span className="text-gray-500">
                            Última tentativa: {format(new Date(ultimaTentativa.finalizado), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal para Realizar Quiz */}
      <RealizarQuizModal
        quizId={selectedQuizId}
        open={showRealizarQuiz}
        onClose={() => {
          setShowRealizarQuiz(false);
          setSelectedQuizId(null);
        }}
        onSuccess={handleQuizSuccess}
      />
    </div>
  );
}