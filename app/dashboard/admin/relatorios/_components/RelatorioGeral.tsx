"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  GraduationCap,
  Eye,
  Download,
  TrendingUp,
  Clock
} from "lucide-react";
import { RelatorioGeral as RelatorioGeralType, FiltrosRelatorio } from "../_types/relatorio.types";

interface RelatorioGeralProps {
  data: RelatorioGeralType | null;
  loading: boolean;
  filtros: FiltrosRelatorio;
}

export default function RelatorioGeral({ data, loading, filtros }: RelatorioGeralProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Dados não disponíveis
        </h3>
        <p className="text-gray-600">
          Não foi possível carregar os dados do relatório geral.
        </p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-MZ").format(num);
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Usuários */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.usuarios.total)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(data.usuarios.novosUltimos30Dias)} nos últimos 30 dias
            </p>
          </CardContent>
        </Card>

        {/* Total de Conteúdos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conteúdos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.conteudos.total)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(data.conteudos.aprovados)} aprovados
            </p>
          </CardContent>
        </Card>

        {/* Total de Visualizações */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.conteudos.totalVisualizacoes)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(data.conteudos.totalDownloads)} downloads
            </p>
          </CardContent>
        </Card>

        {/* Dúvidas Criadas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dúvidas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.atividade.duvidasCriadas)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(data.atividade.respostasEnviadas)} respostas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estudantes</span>
                <span className="text-sm text-gray-600">
                  {formatNumber(data.usuarios.estudantes)} ({((data.usuarios.estudantes / data.usuarios.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Professores</span>
                <span className="text-sm text-gray-600">
                  {formatNumber(data.usuarios.professores)} ({((data.usuarios.professores / data.usuarios.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Administradores</span>
                <span className="text-sm text-gray-600">
                  {formatNumber(data.usuarios.admins)} ({((data.usuarios.admins / data.usuarios.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Conteúdos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Aprovados</span>
                <span className="text-sm text-green-600">
                  {formatNumber(data.conteudos.aprovados)} ({((data.conteudos.aprovados / data.conteudos.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pendentes</span>
                <span className="text-sm text-yellow-600">
                  {formatNumber(data.conteudos.pendentes)} ({((data.conteudos.pendentes / data.conteudos.total) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rejeitados</span>
                <span className="text-sm text-red-600">
                  {formatNumber(data.conteudos.rejeitados)} ({((data.conteudos.rejeitados / data.conteudos.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conteúdos Mais Acessados */}
      {data.conteudos.maisAcessados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conteúdos Mais Acessados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.conteudos.maisAcessados.slice(0, 5).map((conteudo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{conteudo.titulo}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(conteudo.visualizacoes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {formatNumber(conteudo.downloads)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disciplinas Mais Populares */}
      {data.disciplinas.maisPopulares.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Disciplinas Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.disciplinas.maisPopulares.slice(0, 5).map((disciplina, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{disciplina.nome}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatNumber(disciplina.estudantes)} estudantes
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {formatNumber(disciplina.conteudos)} conteúdos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}