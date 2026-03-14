"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Download, 
  Calendar,
  User,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  FileIcon,
  Link
} from "lucide-react";
import { ConteudoEducacional } from "../_types/conteudo.types";

interface ConteudosTableProps {
  conteudos: ConteudoEducacional[];
  loading: boolean;
  onView: (conteudo: ConteudoEducacional) => void;
  onApprove: (conteudoId: string) => void;
  onReject: (conteudoId: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
}

const tipoIcons = {
  LIVRO: BookOpen,
  MODULO: FileText,
  MATERIAL_COMPLEMENTAR: FileIcon,
  ARTIGO: FileText,
  VIDEO: Video,
  EXERCICIO: FileText,
};

const tipoLabels = {
  LIVRO: "Livro",
  MODULO: "Módulo", 
  MATERIAL_COMPLEMENTAR: "Material Complementar",
  ARTIGO: "Artigo",
  VIDEO: "Vídeo",
  EXERCICIO: "Exercício",
};

export default function ConteudosTable({
  conteudos,
  loading,
  onView,
  onApprove,
  onReject,
  onPageChange,
  currentPage,
}: ConteudosTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<void>, conteudoId: string) => {
    try {
      setActionLoading(conteudoId);
      await action();
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
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
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conteudos.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-gray-600">
          Não há conteúdos que correspondam aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conteudos.map((conteudo) => {
        const TipoIcon = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileText;
        
        return (
          <div
            key={conteudo.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {/* Título e Tipo */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {(() => {
                      const IconComponent = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileIcon;
                      return <IconComponent className="w-5 h-5 text-gray-500" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {conteudo.titulo}
                    </h3>
                    {conteudo.descricao && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {conteudo.descricao}
                      </p>
                    )}
                  </div>
                </div>

                {/* Metadados */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{conteudo.disciplina.nome}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{conteudo.autor || "Autor desconhecido"}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(conteudo.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{conteudo.visualizacoes} visualizações</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{conteudo.visualizacoes} downloads</span>
                  </div>
                </div>

                {/* Tags e Status */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {tipoLabels[conteudo.tipo]}
                  </Badge>
                  
                  <Badge variant="outline">
                    {conteudo.disciplina.nivelEnsino === "ENSINO_PRIMARIO" 
                      ? "Ensino Primário" 
                      : "Ensino Secundário"}
                  </Badge>

                  {conteudo.topico && (
                    <Badge variant="outline">
                      {conteudo.topico.nome}
                    </Badge>
                  )}

                  <Badge 
                    variant={conteudo.publicado ? "default" : "secondary"}
                    className={conteudo.publicado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                  >
                    {conteudo.publicado ? "Aprovado" : "Pendente"}
                  </Badge>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(conteudo)}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>

                {!conteudo.publicado && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(async () => await onApprove(conteudo.id), conteudo.id)}
                      disabled={actionLoading === conteudo.id}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(async () => await onReject(conteudo.id), conteudo.id)}
                      disabled={actionLoading === conteudo.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {conteudo.publicado && (
                  <div className="text-xs text-gray-500 text-center">
                    Aprovado
                    {conteudo.updatedAt && (
                      <div>{formatDate(conteudo.updatedAt)}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

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
            disabled={conteudos.length < 20} // Assumindo limit de 20
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}