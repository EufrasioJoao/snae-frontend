"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Eye, 
  Edit, 
  Users, 
  TrendingUp, 
  CheckCircle 
} from "lucide-react";
import { AvaliacaoStats } from "../_types/professor-avaliacao.types";

interface AvaliacoesStatsProps {
  stats: AvaliacaoStats;
}

export default function AvaliacoesStats({ stats }: AvaliacoesStatsProps) {
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('pt-MZ');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total de Quizzes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Quizzes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalQuizzes)}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {formatNumber(stats.quizzesPublicados)} publicados
            </Badge>
            <Badge variant="outline" className="text-xs">
              {formatNumber(stats.quizzesRascunho)} rascunhos
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total de Tentativas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Tentativas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalTentativas)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Tentativas realizadas pelos estudantes
          </p>
        </CardContent>
      </Card>

      {/* Média das Notas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média das Notas</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mediaNotas.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Média geral de todas as tentativas
          </p>
        </CardContent>
      </Card>

      {/* Taxa de Aprovação */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(stats.taxaAprovacao)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Estudantes que atingiram a nota mínima
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas por Disciplina */}
      {stats.porDisciplina.length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Por Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.porDisciplina.slice(0, 3).map((disciplina) => (
                <div key={disciplina.disciplinaId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{disciplina.disciplinaNome}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(disciplina.totalQuizzes)} quizzes • {formatNumber(disciplina.totalTentativas)} tentativas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{disciplina.mediaNotas.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">média</p>
                  </div>
                </div>
              ))}
              {stats.porDisciplina.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  +{stats.porDisciplina.length - 3} disciplinas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}