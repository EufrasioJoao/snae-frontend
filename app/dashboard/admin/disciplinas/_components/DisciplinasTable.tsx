"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Users, FileText, BookOpen } from "lucide-react";
import { Disciplina } from "../_types/disciplina.types";
import { formatNivelEnsino, formatDate, getNivelEnsinoColor } from "../_utils/formatters";

interface DisciplinasTableProps {
  disciplinas: Disciplina[];
  loading: boolean;
  onView: (disciplina: Disciplina) => void;
  onEdit: (disciplina: Disciplina) => void;
  onDelete: (disciplina: Disciplina) => void;
}

export default function DisciplinasTable({
  disciplinas,
  loading,
  onView,
  onEdit,
  onDelete,
}: DisciplinasTableProps) {
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disciplina</TableHead>
              <TableHead>Área de Conhecimento</TableHead>
              <TableHead>Nível de Ensino</TableHead>
              <TableHead>Professores</TableHead>
              <TableHead>Conteúdos</TableHead>
              <TableHead>Criada em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Nenhuma disciplina encontrada</p>
        <p className="text-gray-400 text-sm">
          Crie uma nova disciplina para começar
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Disciplina</TableHead>
            <TableHead>Área de Conhecimento</TableHead>
            <TableHead>Nível de Ensino</TableHead>
            <TableHead>Professores</TableHead>
            <TableHead>Conteúdos</TableHead>
            <TableHead>Criada em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disciplinas.map((disciplina) => (
            <TableRow key={disciplina.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">{disciplina.nome}</div>
                  {disciplina.descricao && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {disciplina.descricao}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm font-medium text-gray-700">
                  {disciplina.areaConhecimento.nome}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className={getNivelEnsinoColor(disciplina.nivelEnsino)}>
                  {formatNivelEnsino(disciplina.nivelEnsino)}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {disciplina._count?.professores || 0}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-1" />
                  {disciplina._count?.conteudos || 0}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm text-gray-500">
                  {formatDate(disciplina.createdAt)}
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(disciplina)}
                    title="Ver detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(disciplina)}
                    title="Editar disciplina"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(disciplina)}
                    className="text-red-600 hover:text-red-700"
                    title="Excluir disciplina"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}