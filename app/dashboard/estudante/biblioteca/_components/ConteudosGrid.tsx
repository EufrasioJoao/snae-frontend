"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { ConteudoBiblioteca, ConteudoDetalhado } from "../_types/biblioteca.types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConteudosGridProps {
  conteudos: (ConteudoBiblioteca | ConteudoDetalhado)[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onView: (conteudo: ConteudoBiblioteca | ConteudoDetalhado) => void;
  onOpen?: (conteudo: ConteudoBiblioteca | ConteudoDetalhado) => void;
}

export default function ConteudosGrid({
  conteudos,
  loading,
  pagination,
  onPageChange,
  onView,
  onOpen
}: ConteudosGridProps) {
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
      LIVRO: "Livro",
      MODULO: "Módulo",
      MATERIAL_COMPLEMENTAR: "Material",
      ARTIGO: "Artigo",
      VIDEO: "Vídeo",
      EXERCICIO: "Exercício"
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getTypeBadgeColor = (tipo: string) => {
    const colors = {
      LIVRO: "bg-blue-100 text-blue-800",
      MODULO: "bg-green-100 text-green-800",
      MATERIAL_COMPLEMENTAR: "bg-purple-100 text-purple-800",
      ARTIGO: "bg-orange-100 text-orange-800",
      VIDEO: "bg-red-100 text-red-800",
      EXERCICIO: "bg-yellow-100 text-yellow-800"
    };
    return colors[tipo as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return null;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (conteudos.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-gray-500">
          Não há conteúdos que correspondam aos filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {conteudos.map((conteudo) => {
          const TypeIcon = getTypeIcon(conteudo.tipo);
          return (
            <Card key={conteudo.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-gray-100">
                      <TypeIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <Badge className={`text-xs ${getTypeBadgeColor(conteudo.tipo)}`}>
                      {getTypeLabel(conteudo.tipo)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Eye className="h-3 w-3" />
                    {conteudo.visualizacoes}
                  </div>
                </div>
                <CardTitle className="text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {conteudo.titulo}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {conteudo.descricao && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {conteudo.descricao}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <BookOpen className="h-3 w-3" />
                    <span className="truncate">{conteudo.disciplina.nome}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{conteudo.autor}</span>
                  </div>

                  {conteudo.anoPublicacao && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>{conteudo.anoPublicacao}</span>
                    </div>
                  )}

                  {conteudo.tamanhoArquivo && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Download className="h-3 w-3" />
                      <span>{formatFileSize(conteudo.tamanhoArquivo)}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge variant="outline" className="text-xs">
                    {conteudo.disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Primário" : "Secundário"}
                  </Badge>
                  
                  <div className="flex gap-1">
                    {('urlDownload' in conteudo) && conteudo.urlDownload && onOpen && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen(conteudo);
                        }}
                        className="text-xs"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Abrir
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onView(conteudo)}
                      className="text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-gray-400 pt-1 border-t">
                  {formatDistanceToNow(new Date(conteudo.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} conteúdos
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  const current = pagination.page;
                  return page === 1 || page === pagination.totalPages || 
                         (page >= current - 1 && page <= current + 1);
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <Button
                      variant={page === pagination.page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}