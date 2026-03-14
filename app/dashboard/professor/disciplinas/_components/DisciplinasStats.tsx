"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  FileText, 
  MessageCircleQuestion,
  Clock,
  CheckCircle
} from "lucide-react";
import { ProfessorDisciplinaStats } from "../_types/professor-disciplina.types";

interface DisciplinasStatsProps {
  stats: ProfessorDisciplinaStats;
  loading?: boolean;
}

export default function DisciplinasStats({ stats, loading = false }: DisciplinasStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-MZ").format(num);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total de Disciplinas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalDisciplinas)}</div>
          <p className="text-xs text-muted-foreground">
            Disciplinas que você leciona
          </p>
        </CardContent>
      </Card>

      {/* Total de Estudantes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalEstudantes)}</div>
          <p className="text-xs text-muted-foreground">
            Total de estudantes
          </p>
        </CardContent>
      </Card>

      {/* Total de Conteúdos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conteúdos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.totalConteudos)}</div>
          <p className="text-xs text-muted-foreground">
            {formatNumber(stats.conteudosPendentes)} pendentes de aprovação
          </p>
        </CardContent>
      </Card>

      {/* Dúvidas Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dúvidas Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatNumber(stats.duvidasPendentes)}
          </div>
          <p className="text-xs text-muted-foreground">
            De {formatNumber(stats.totalDuvidas)} total
          </p>
        </CardContent>
      </Card>

      {/* Disciplinas Mais Ativas */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Disciplinas Mais Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.disciplinasMaisAtivas.length > 0 ? (
            <div className="space-y-3">
              {stats.disciplinasMaisAtivas.slice(0, 3).map((disciplina, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{disciplina.nome}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatNumber(disciplina.estudantes)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircleQuestion className="w-3 h-3" />
                      {formatNumber(disciplina.duvidas)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhuma atividade recente
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}