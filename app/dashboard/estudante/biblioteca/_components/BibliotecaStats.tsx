"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, BookOpen, FileText, Video, Eye } from "lucide-react";
import { BibliotecaStats as StatsType } from "../_types/biblioteca.types";

interface BibliotecaStatsProps {
  stats: StatsType;
}

export default function BibliotecaStats({ stats }: BibliotecaStatsProps) {
  const getTypeIcon = (tipo: string) => {
    const icons = {
      LIVRO: BookOpen,
      MODULO: FileText,
      MATERIAL_COMPLEMENTAR: FileText,
      ARTIGO: FileText,
      VIDEO: Video,
      EXERCICIO: FileText
    };
    return icons[tipo as keyof typeof icons] || FileText;
  };

  const getTypeLabel = (tipo: string) => {
    const labels = {
      LIVRO: "Livros",
      MODULO: "Módulos",
      MATERIAL_COMPLEMENTAR: "Materiais",
      ARTIGO: "Artigos",
      VIDEO: "Vídeos",
      EXERCICIO: "Exercícios"
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Conteúdos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total de Conteúdos
          </CardTitle>
          <div className="p-2 rounded-lg bg-purple-100">
            <Library className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalConteudos}</div>
          <p className="text-xs text-gray-500 mt-1">
            Disponíveis na biblioteca
          </p>
        </CardContent>
      </Card>

      {/* Conteúdos por Tipo (Top 3) */}
      {stats.porTipo.slice(0, 3).map((item, index) => {
        const Icon = getTypeIcon(item.tipo);
        return (
          <Card key={item.tipo}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {getTypeLabel(item.tipo)}
              </CardTitle>
              <div className="p-2 rounded-lg bg-blue-100">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.count}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((item.count / stats.totalConteudos) * 100).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>
        );
      })}

      {/* Mais Visualizados */}
      {stats.maisVisualizados.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Conteúdos Mais Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.maisVisualizados.slice(0, 3).map((conteudo, index) => (
                <div key={conteudo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{conteudo.titulo}</p>
                      <p className="text-xs text-gray-500">{conteudo.disciplina}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Eye className="h-3 w-3" />
                    {conteudo.visualizacoes}
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