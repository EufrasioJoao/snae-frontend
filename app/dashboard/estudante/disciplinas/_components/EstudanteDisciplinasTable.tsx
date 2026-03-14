"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen,
  Calendar,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EstudanteDisciplina } from "../_types/estudante-disciplina.types";

interface EstudanteDisciplinasTableProps {
  disciplinas: EstudanteDisciplina[];
  loading: boolean;
  onDesassociar: (disciplinaId: string) => void;
}

export default function EstudanteDisciplinasTable({
  disciplinas,
  loading,
  onDesassociar,
}: EstudanteDisciplinasTableProps) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    disciplina: EstudanteDisciplina | null;
  }>({
    isOpen: false,
    disciplina: null,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDesassociar = (disciplina: EstudanteDisciplina) => {
    setConfirmModal({
      isOpen: true,
      disciplina,
    });
  };

  const confirmDesassociar = () => {
    if (confirmModal.disciplina) {
      onDesassociar(confirmModal.disciplina.disciplinaId);
      setConfirmModal({ isOpen: false, disciplina: null });
    }
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

  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma disciplina encontrada
        </h3>
        <p className="text-gray-500">
          Não há disciplinas nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Disciplina</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nível</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Área</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Data Associação</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {disciplinas.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">
                          {item.disciplina.nome}
                        </h3>
                        {item.disciplina.descricao && (
                          <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {item.disciplina.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">
                      {item.disciplina.nivelEnsino === "ENSINO_PRIMARIO" 
                        ? "Ensino Primário" 
                        : "Ensino Secundário"}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-900">
                      {item.disciplina.areaConhecimento.nome}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(item.dataAssociacao)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDesassociar(item)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {disciplinas.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Título */}
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <BookOpen className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.disciplina.nome}
                      </h3>
                      {item.disciplina.descricao && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {item.disciplina.descricao}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Metadados */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      {item.disciplina.nivelEnsino === "ENSINO_PRIMARIO" 
                        ? "Ensino Primário" 
                        : "Ensino Secundário"}
                    </Badge>
                    <Badge variant="outline">
                      {item.disciplina.areaConhecimento.nome}
                    </Badge>
                  </div>

                  {/* Data */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Associado em {formatDate(item.dataAssociacao)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDesassociar(item)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog 
        open={confirmModal.isOpen} 
        onOpenChange={(open) => !open && setConfirmModal({ isOpen: false, disciplina: null })}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <DialogTitle>Remover Disciplina</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Tem certeza que deseja remover a disciplina{" "}
              <strong>"{confirmModal.disciplina?.disciplina.nome}"</strong> da sua lista?
            </p>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setConfirmModal({ isOpen: false, disciplina: null })}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDesassociar}>
                Remover
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}