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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Quiz } from "../_types/professor-avaliacao.types";

interface AvaliacoesTableProps {
  quizzes: Quiz[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onView: (quiz: Quiz) => void;
  onEdit: (quiz: Quiz) => void;
  onDelete: (quizId: string) => void;
  onTogglePublicacao: (quizId: string, publicado: boolean) => void;
}

export default function AvaliacoesTable({
  quizzes,
  loading,
  pagination,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onTogglePublicacao
}: AvaliacoesTableProps) {
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);

  const handleDeleteClick = (quizId: string) => {
    setDeleteQuizId(quizId);
  };

  const handleDeleteConfirm = () => {
    if (deleteQuizId) {
      onDelete(deleteQuizId);
      setDeleteQuizId(null);
    }
  };

  const getStatusBadge = (publicado: boolean) => {
    if (publicado) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Publicado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <FileText className="h-3 w-3 mr-1" />
        Rascunho
      </Badge>
    );
  };

  const formatNivelEnsino = (nivel: string) => {
    switch (nivel) {
      case "ENSINO_PRIMARIO":
        return "Primário";
      case "ENSINO_SECUNDARIO":
        return "Secundário";
      default:
        return nivel;
    }
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

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum quiz encontrado
        </h3>
        <p className="text-gray-500 mb-4">
          Comece criando o seu primeiro quiz para avaliar os estudantes.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Questões</TableHead>
              <TableHead>Tentativas</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{quiz.titulo}</p>
                    {quiz.descricao && (
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {quiz.descricao}
                      </p>
                    )}
                    {quiz.tempoLimite && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {quiz.tempoLimite} min
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{quiz.disciplina.nome}</p>
                    <p className="text-xs text-gray-500">
                      {formatNivelEnsino(quiz.disciplina.nivelEnsino)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(quiz.publicado)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>{quiz._count.questoes}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{quiz._count.tentativas}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {format(new Date(quiz.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(quiz)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(quiz)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onTogglePublicacao(quiz.id, !quiz.publicado)}
                      >
                        {quiz.publicado ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Despublicar
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publicar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(quiz.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} quizzes
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Anterior
            </Button>
            
            <span className="text-sm">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!deleteQuizId} onOpenChange={() => setDeleteQuizId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este quiz? Esta ação não pode ser desfeita.
              Todas as tentativas dos estudantes também serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}