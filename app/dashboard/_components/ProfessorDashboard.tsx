"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  Plus
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { User } from "@/types";
import apiRequests from "@/lib/api-requests";

interface ProfessorStats {
  totalDisciplinas: number;
  totalDuvidas: number;
  totalConteudos: number;
  totalQuizzes: number;
  duvidasPendentes: number;
  conteudosPendentes: number;
  estudantesAtivos: number;
  mediaRespostas: number;
}

interface AtividadeRecente {
  id: string;
  tipo: 'DUVIDA' | 'CONTEUDO' | 'QUIZ';
  titulo: string;
  data: string;
  status?: string;
}

interface ProfessorDashboardProps {
  user: User;
}

export default function ProfessorDashboard({ user }: ProfessorDashboardProps) {
  const [stats, setStats] = useState<ProfessorStats | null>(null);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados reais do servidor
      const [statsResponse, activitiesResponse] = await Promise.all([
        apiRequests.professor.getDashboardStats(),
        apiRequests.professor.getRecentActivities(10)
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      } else {
        toast.error("Erro ao carregar estatísticas");
      }

      if (activitiesResponse.success) {
        setAtividades(activitiesResponse.activities);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dashboard");
    } finally {
      setLoading(false);
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
        <p className="text-gray-600">Gerencie suas disciplinas, dúvidas e conteúdos</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDisciplinas}</div>
              <p className="text-xs text-muted-foreground">
                Disciplinas que leciona
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dúvidas</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDuvidas}</div>
              <p className="text-xs text-muted-foreground">
                {stats.duvidasPendentes} pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConteudos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.conteudosPendentes} em análise
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.estudantesAtivos}</div>
              <p className="text-xs text-muted-foreground">
                Estudantes ativos
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
            <Link href="/dashboard/professor/conteudos/criar">
              <Button className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-5 w-5" />
                Criar Conteúdo
              </Button>
            </Link>
            
            <Link href="/dashboard/professor/avaliacoes">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-5 w-5" />
                Criar Quiz
              </Button>
            </Link>
            
            <Link href="/dashboard/professor/duvidas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <MessageSquare className="h-5 w-5" />
                Ver Dúvidas
              </Button>
            </Link>
            
            <Link href="/dashboard/professor/disciplinas">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BookOpen className="h-5 w-5" />
                Minhas Disciplinas
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {atividades.map((atividade) => (
                <div key={atividade.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    {atividade.tipo === 'DUVIDA' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                    {atividade.tipo === 'CONTEUDO' && <FileText className="h-4 w-4 text-blue-600" />}
                    {atividade.tipo === 'QUIZ' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{atividade.titulo}</h4>
                    <p className="text-xs text-gray-500">
                      {new Date(atividade.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  {atividade.status && (
                    <div className="text-right">
                      {atividade.status === 'PENDENTE' && (
                        <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                          Pendente
                        </span>
                      )}
                      {atividade.status === 'APROVADO' && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Aprovado
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Resumo Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dúvidas respondidas</span>
                <span className="font-medium">12</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Conteúdos criados</span>
                <span className="font-medium">3</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Quizzes aplicados</span>
                <span className="font-medium">2</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo médio de resposta</span>
                <span className="font-medium">2.5h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}