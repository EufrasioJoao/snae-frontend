"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircleQuestion, 
  User, 
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { Duvida } from "../_types/professor-duvida.types";

interface DuvidasTableProps {
  duvidas: Duvida[];
  loading: boolean;
  onViewDuvida: (duvida: Duvida) => void;
  onResponder: (duvidaId: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const prioridadeColors = {
  BAIXA: "bg-green-100 text-green-800",
  MEDIA: "bg-yellow-100 text-yellow-800", 
  ALTA: "bg-red-100 text-red-800",
};

const statusColors = {
  PENDENTE: "bg-yellow-100 text-yellow-800",
  EM_ANALISE: "bg-orange-100 text-orange-800",
  RESPONDIDA: "bg-blue-100 text-blue-800",
  FECHADA: "bg-gray-100 text-gray-800",
};

export default function DuvidasTable({
  duvidas,
  loading,
  onViewDuvida,
  onResponder,
  currentPage,
  onPageChange,
}: DuvidasTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    return formatDate(dateString);
  };

  const handleAction = async (action: () => Promise<void>, duvidaId: string) => {
    try {
      setActionLoading(duvidaId);
      await action();
    } finally {
      setActionLoading(null);
    }
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

  if (duvidas.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircleQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma dúvida encontrada
        </h3>
        <p className="text-gray-600">
          Não há dúvidas que correspondam aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {duvidas.map((duvida) => (
        <div
          key={duvida.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Título e Status */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {duvida.status === "PENDENTE" ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : duvida.status === "EM_ANALISE" ? (
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  ) : duvida.status === "RESPONDIDA" ? (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {duvida.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {duvida.descricao}
                  </p>
                </div>
              </div>

              {/* Metadados */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{duvida.estudante.name} ({duvida.estudante.anoEscolar}ª classe)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{duvida.disciplina.nome}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatTimeAgo(duvida.createdAt)}</span>
                </div>

                {duvida.respostas.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{duvida.respostas.length} respostas</span>
                  </div>
                )}
              </div>

              {/* Tags e Status */}
              <div className="flex items-center gap-2">
                <Badge className={statusColors[duvida.status]}>
                  {duvida.status === "PENDENTE" ? "Pendente" : 
                   duvida.status === "EM_ANALISE" ? "Em Análise" :
                   duvida.status === "RESPONDIDA" ? "Respondida" : "Fechada"}
                </Badge>
                
                {duvida.prioridade && (
                  <Badge className={prioridadeColors[duvida.prioridade]}>
                    Prioridade {duvida.prioridade.toLowerCase()}
                  </Badge>
                )}

                {duvida.tags && duvida.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDuvida(duvida)}
                className="w-full"
              >
                <MessageCircleQuestion className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>

              {duvida.status === "PENDENTE" && (
                <Button
                  size="sm"
                  onClick={() => handleAction(async () => await onResponder(duvida.id), duvida.id)}
                  disabled={actionLoading === duvida.id}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Responder
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Paginação simples */}
      <div className="flex justify-center pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          
          <span className="flex items-center px-4 text-sm text-gray-600">
            Página {currentPage}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={duvidas.length < 20} // Assumindo limit de 20
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}