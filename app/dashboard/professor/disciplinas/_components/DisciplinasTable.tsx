"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Plus, 
  MessageCircleQuestion,
  Users,
  FileText,
  BookOpen,
  Clock,
  Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfessorDisciplina } from "../_types/professor-disciplina.types";

interface DisciplinasTableProps {
  disciplinas: ProfessorDisciplina[];
  loading: boolean;
  onViewDisciplina: (disciplina: ProfessorDisciplina) => void;
  onCreateContent: (disciplinaId: string) => void;
  onViewDuvidas: (disciplinaId: string) => void;
}

export default function DisciplinasTable({
  disciplinas,
  loading,
  onViewDisciplina,
  onCreateContent,
  onViewDuvidas,
}: DisciplinasTableProps) {
  const router = useRouter();
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-blue-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Nenhuma disciplina associada
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Para começar a lecionar e criar conteúdos, você precisa se associar às disciplinas que ensina. 
            Isso permitirá que você gerencie conteúdos, responda dúvidas dos estudantes e acompanhe o progresso.
          </p>
          <Button
            onClick={() => router.push("/dashboard/professor/disciplinas/associar")}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Associar Disciplinas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {disciplinas.map((disciplina) => (
        <div
          key={disciplina.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Título e Área */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {disciplina.nome}
                  </h3>
                  {disciplina.descricao && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {disciplina.descricao}
                    </p>
                  )}
                </div>
              </div>

              {/* Metadados */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Badge variant="outline">
                    {disciplina.areaConhecimento.nome}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <Badge variant="outline">
                    {disciplina.nivelEnsino === "ENSINO_PRIMARIO" 
                      ? "Ensino Primário" 
                      : "Ensino Secundário"}
                  </Badge>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{disciplina.totalEstudantes} estudantes</span>
                </div>

                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{disciplina.totalConteudos} conteúdos</span>
                </div>

                <div className="flex items-center gap-1">
                  <MessageCircleQuestion className="w-4 h-4" />
                  <span>{disciplina.totalDuvidas} dúvidas</span>
                </div>

                {disciplina.duvidasPendentes > 0 && (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Clock className="w-4 h-4" />
                    <span>{disciplina.duvidasPendentes} pendentes</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span>Última atividade: {formatDate(disciplina.ultimaAtividade)}</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDisciplina(disciplina)}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onCreateContent(disciplina.id)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Conteúdo
              </Button>

              {disciplina.duvidasPendentes > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDuvidas(disciplina.id)}
                  className="w-full text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  <MessageCircleQuestion className="w-4 h-4 mr-2" />
                  Ver Dúvidas ({disciplina.duvidasPendentes})
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}