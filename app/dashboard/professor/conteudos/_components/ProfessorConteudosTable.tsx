"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  BookOpen,
  FileText,
  Video,
  FileIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ConteudoEducacional } from "../../../admin/conteudos/_types/conteudo.types";

interface ProfessorConteudosTableProps {
  conteudos: ConteudoEducacional[];
  loading: boolean;
  onView: (conteudo: ConteudoEducacional) => void;
  onEdit: (conteudo: ConteudoEducacional) => void;
  onDelete: (conteudo: ConteudoEducacional) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  total: number;
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

export default function ProfessorConteudosTable({
  conteudos,
  loading,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  currentPage,
  totalPages,
  total
}: ProfessorConteudosTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (conteudos.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum conteúdo encontrado
        </h3>
        <p className="text-gray-500">
          Você ainda não criou nenhum conteúdo educacional.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Conteúdo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Tipo</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Disciplina</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Visualizações</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
              <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
            </tr>
          </thead>
          <tbody>
            {conteudos.map((conteudo) => {
              const IconComponent = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileIcon;
              
              return (
                <tr key={conteudo.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {conteudo.titulo}
                        </h3>
                        {conteudo.descricao && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {conteudo.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">
                      {tipoLabels[conteudo.tipo as keyof typeof tipoLabels]}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{conteudo.disciplina.nome}</p>
                      <p className="text-sm text-gray-500">
                        {conteudo.disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Ensino Primário" : "Ensino Secundário"}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant={conteudo.publicado ? "default" : "secondary"}>
                      {conteudo.publicado ? "Aprovado" : "Pendente"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {conteudo.visualizacoes}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {formatDate(conteudo.createdAt)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(conteudo)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(conteudo)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(conteudo)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {conteudos.map((conteudo) => {
          const IconComponent = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileIcon;
          
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
                      <IconComponent className="w-5 h-5 text-gray-500" />
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
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {tipoLabels[conteudo.tipo as keyof typeof tipoLabels]}
                    </Badge>
                    <Badge variant={conteudo.publicado ? "default" : "secondary"}>
                      {conteudo.publicado ? "Aprovado" : "Pendente"}
                    </Badge>
                  </div>

                  {/* Disciplina e Data */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{conteudo.disciplina.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(conteudo.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{conteudo.visualizacoes} visualizações</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(conteudo)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(conteudo)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(conteudo)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * 20) + 1} a {Math.min(currentPage * 20, total)} de {total} conteúdos
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}