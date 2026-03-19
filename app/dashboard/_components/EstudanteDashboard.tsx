"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Target, 
  Trophy, 
  Clock, 
  TrendingUp,
  Play,
  MessageSquare,
  Flame,
  Star
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/types";
import apiRequests from "@/lib/api-requests";

interface EstudanteStats {
  totalDisciplinas: number;
  quizzesRealizados: number;
  quizzesPendentes: number;
  mediaGeral: number;
  tempoEstudo: number;
  sequenciaAtual: number;
  nivel: number;
  pontosTotal: number;
  proximoNivel: number;
}

interface QuizPendente {
  id: string;
  titulo: string;
  disciplina: string;
  questoes: number;
  tempoLimite?: number;
}

interface ConquistaRecente {
  id: string;
  nome: string;
  icone: string;
  dataDesbloqueio: string;
}

interface EstudanteDashboardProps {
  user: User;
}

export default function EstudanteDashboard({ user }: EstudanteDashboardProps) {
  const [stats, setStats] = useState<EstudanteStats | null>(null);
  const [quizzesPendentes, setQuizzesPendentes] = useState<QuizPendente[]>([]);
  const [conquistasRecentes, setConquistasRecentes] = useState<ConquistaRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados reais do servidor
      const [statsResponse, quizzesResponse, conquistasResponse] = await Promise.all([
        apiRequests.estudante.getDashboardStats(),
        apiRequests.estudante.getQuizzesPendentes(2),
        apiRequests.estudante.getConquistas().catch(() => ({ success: false, conquistas: [] }))
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      } else {
        toast.error("Erro ao carregar estatísticas");
      }

      if (quizzesResponse.success) {
        setQuizzesPendentes(quizzesResponse.quizzes);
      }

      if (conquistasResponse.success && conquistasResponse.conquistas) {
        // Pegar as 2 conquistas mais recentes
        const recentes = conquistasResponse.conquistas
          .slice(0, 2)
          .map((c: any) => ({
            id: c.id,
            nome: c.nome,
            icone: c.icone || 'trophy',
            dataDesbloqueio: c.dataDesbloqueio || new Date().toISOString()
          }));
        setConquistasRecentes(recentes);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getNivelProgress = () => {
    if (!stats) return 0;
    const progressoAtual = stats.pontosTotal - (stats.nivel - 1) * 500;
    const progressoNecessario = stats.proximoNivel - (stats.nivel - 1) * 500;
    return (progressoAtual / progressoNecessario) * 100;
  };

  const getConquistaIcon = (icone: string) => {
    switch (icone) {
      case 'trophy': return Trophy;
      case 'flame': return Flame;
      case 'star': return Star;
      default: return Trophy;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user.name}
        </h1>
        <p className="text-gray-600">Acompanhe seu progresso acadêmico</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nível {stats.nivel}</div>
              <div className="space-y-2 mt-2">
                <Progress value={getNivelProgress()} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {stats.pontosTotal} / {stats.proximoNivel} pontos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediaGeral.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                De 0 a 20 pontos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Estudo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTempo(stats.tempoEstudo)}</div>
              <p className="text-xs text-muted-foreground">
                Total acumulado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sequência</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sequenciaAtual} dias</div>
              <p className="text-xs text-muted-foreground">
                Dias consecutivos
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/estudante/avaliacoes">
              <Button className="w-full h-20 flex flex-col gap-2">
                <Play className="h-5 w-5" />
                Fazer Quiz
              </Button>
            </Link>
            
            <Link href="/dashboard/estudante/biblioteca">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                Biblioteca
              </Button>
            </Link>
            
            <Link href="/dashboard/estudante/assistente">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Flame className="h-5 w-5" />
                Assistente IA
              </Button>
            </Link>
            
            <Link href="/dashboard/estudante/duvidas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                Minhas Dúvidas
              </Button>
            </Link>
            
            <Link href="/dashboard/estudante/progresso">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <TrendingUp className="h-5 w-5" />
                Meu Progresso
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quizzes Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quizzes Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quizzesPendentes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum quiz pendente no momento
                </p>
              ) : (
                quizzesPendentes.map((quiz) => (
                  <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{quiz.titulo}</h4>
                      <p className="text-xs text-gray-500">{quiz.disciplina}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{quiz.questoes} questões</span>
                        {quiz.tempoLimite && (
                          <span className="text-xs text-gray-400">• {quiz.tempoLimite} min</span>
                        )}
                      </div>
                    </div>
                    <Link href={`/dashboard/estudante/avaliacoes`}>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conquistas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Conquistas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conquistasRecentes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma conquista recente
                </p>
              ) : (
                conquistasRecentes.map((conquista) => {
                  const IconComponent = getConquistaIcon(conquista.icone);
                  return (
                    <div key={conquista.id} className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="p-2 bg-yellow-200 rounded-full">
                        <IconComponent className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{conquista.nome}</h4>
                        <p className="text-xs text-gray-500">
                          Desbloqueada em {new Date(conquista.dataDesbloqueio).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              
              <Link href="/dashboard/estudante/progresso">
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Ver Todas as Conquistas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo do Progresso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Quizzes Realizados</span>
                  <span>{stats.quizzesRealizados}/{stats.quizzesRealizados + stats.quizzesPendentes}</span>
                </div>
                <Progress value={(stats.quizzesRealizados / (stats.quizzesRealizados + stats.quizzesPendentes)) * 100} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disciplinas Ativas</span>
                  <span>{stats.totalDisciplinas}</span>
                </div>
                <Progress value={100} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso do Nível</span>
                  <span>{Math.round(getNivelProgress())}%</span>
                </div>
                <Progress value={getNivelProgress()} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}