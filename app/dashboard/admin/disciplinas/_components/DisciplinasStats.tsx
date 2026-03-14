"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Users, FileText } from "lucide-react";
import { DisciplinaStats } from "../_types/disciplina.types";

interface DisciplinasStatsProps {
  stats: DisciplinaStats;
  loading?: boolean;
}

export default function DisciplinasStats({ stats, loading }: DisciplinasStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="animate-pulse bg-gray-200 h-4 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse bg-gray-200 h-8 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Total de Disciplinas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Ensino Primário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.primario}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Ensino Secundário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.secundario}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2" />
            Áreas de Conhecimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.areasConhecimento}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Professores Associados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.professoresAssociados}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Conteúdos Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-teal-600">{stats.conteudosTotal}</div>
        </CardContent>
      </Card>
    </div>
  );
}