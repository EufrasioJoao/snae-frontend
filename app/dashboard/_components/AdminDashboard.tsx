"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import apiRequests from "@/lib/api-requests";
import { User } from "@/types";

interface AdminDashboardProps {
  user: User;
}

interface AdminStats {
  totalUsuarios: number;
  usuariosAtivos: number;
  totalDisciplinas: number;
  totalConteudos: number;
  conteudosPendentes: number;
  totalQuizzes: number;
  atividadeRecente: {
    novosUsuarios: number;
    conteudosAdicionados: number;
    quizzesRealizados: number;
  };
}

interface AtividadeRecente {
  id: string;
  tipo: 'USER' | 'CONTENT' | 'QUIZ';
  titulo: string;
  usuario: string;
  data: string;
  status?: string;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [atividades, setAtividades] = useState<AtividadeRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Por enquanto, usar dados mock até implementar as APIs
      const mockStats: AdminStats = {
        totalUsuarios: 1247,
        usuariosAtivos: 892,
        totalDisciplinas: 32,
        totalConteudos: 156,
        conteudosPendentes: 8,
        totalQuizzes: 89,
        atividadeRecente: {
          novosUsuarios: 23,
          conteudosAdicionados: 12,
          quizzesRealizados: 145
        }
      };

      const mockAtividades: AtividadeRecente[] = [
        {
          id: '1',
          tipo: 'USER',
          titulo: 'Novo usuário registrado',
          usuario: 'João Silva',
          data: new Date().toISOString(),
          status: 'ATIVO'
        },
        {
          id: '2',
          tipo: 'CONTENT',
          titulo: 'Conteúdo enviado para aprovação',
          usuario: 'Prof. Maria Santos',
          data: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'PENDENTE'
        },
        {
          id: '3',
          tipo: 'QUIZ',
          titulo: 'Quiz de Matemática criado',
          usuario: 'Prof. Carlos Lima',
          data: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'PUBLICADO'
        }
      ];

      setStats(mockStats);
      setAtividades(mockAtividades);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (tipo: string) => {
    switch (tipo) {
      case 'USER': return Users;
      case 'CONTENT': return FileText;
      case 'QUIZ': return Target;
      default: return AlertCircle;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ATIVO':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'PENDENTE':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'PUBLICADO':
        return <Badge className="bg-blue-100 text-blue-800">Publicado</Badge>;
      default:
        return null;
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {user.name}
          </h1>
          <p className="text-gray-600">Painel Administrativo - SNAE</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground">
                {stats.usuariosAtivos} ativos ({((stats.usuariosAtivos / stats.totalUsuarios) * 100).toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDisciplinas}</div>
              <p className="text-xs text-muted-foreground">
                Currículo completo
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
                {stats.conteudosPendentes} pendentes de aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                Avaliações disponíveis
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Atividade Recente e Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividade Recente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividades.map((atividade) => {
                const IconComponent = getActivityIcon(atividade.tipo);
                return (
                  <div key={atividade.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{atividade.titulo}</h4>
                      <p className="text-sm text-gray-500">{atividade.usuario}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(atividade.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    
                    {atividade.status && (
                      <div>
                        {getStatusBadge(atividade.status)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full justify-between" 
                variant="outline"
                onClick={() => router.push('/dashboard/admin/users')}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gerenciar Usuários
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                className="w-full justify-between" 
                variant="outline"
                onClick={() => router.push('/dashboard/admin/conteudos')}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Aprovar Conteúdos
                  {stats?.conteudosPendentes && stats.conteudosPendentes > 0 && (
                    <Badge className="bg-red-100 text-red-800 ml-2">
                      {stats.conteudosPendentes}
                    </Badge>
                  )}
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                className="w-full justify-between" 
                variant="outline"
                onClick={() => router.push('/dashboard/admin/disciplinas')}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Gerenciar Disciplinas
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                className="w-full justify-between" 
                variant="outline"
                onClick={() => router.push('/dashboard/admin/relatorios')}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Ver Relatórios
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Atividade */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Resumo de Atividade (Últimos 30 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.atividadeRecente.novosUsuarios}
                </div>
                <p className="text-sm text-blue-800">Novos Usuários</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.atividadeRecente.conteudosAdicionados}
                </div>
                <p className="text-sm text-green-800">Conteúdos Adicionados</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.atividadeRecente.quizzesRealizados}
                </div>
                <p className="text-sm text-purple-800">Quizzes Realizados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}