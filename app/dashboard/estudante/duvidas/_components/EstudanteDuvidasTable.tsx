"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MessageCircle, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { EstudanteDuvida } from "../_types/estudante-duvida.types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EstudanteDuvidasTableProps {
  duvidas: EstudanteDuvida[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onView: (duvida: EstudanteDuvida) => void;
}

export default function EstudanteDuvidasTable({
  duvidas,
  loading,
  pagination,
  onPageChange,
  onView
}: EstudanteDuvidasTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { label: "Pendente", variant: "secondary" as const, icon: Clock },
      EM_ANALISE: { label: "Em Análise", variant: "default" as const, icon: MessageCircle },
      RESPONDIDA: { label: "Respondida", variant: "default" as const, icon: CheckCircle },
      FECHADA: { label: "Fechada", variant: "outline" as const, icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getNivelEnsinoBadge = (nivel: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {nivel === "ENSINO_PRIMARIO" ? "Primário" : "Secundário"}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (duvidas.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma dúvida encontrada
        </h3>
        <p className="text-gray-500">
          Você ainda não criou nenhuma dúvida ou não há dúvidas que correspondam aos filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Respostas</TableHead>
              <TableHead>Criada</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {duvidas.map((duvida) => (
              <TableRow key={duvida.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{duvida.titulo}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {duvida.descricao}
                    </div>
                    {duvida.topico && (
                      <Badge variant="outline" className="text-xs">
                        {duvida.topico.nome}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{duvida.disciplina.nome}</div>
                    <div className="flex items-center gap-2">
                      {getNivelEnsinoBadge(duvida.disciplina.nivelEnsino)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {duvida.disciplina.areaConhecimento}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(duvida.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{duvida.totalRespostas}</span>
                    {duvida.temRespostaProfessor && (
                      <Badge variant="default" className="text-xs">
                        Professor
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(duvida.createdAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(duvida)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} dúvidas
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