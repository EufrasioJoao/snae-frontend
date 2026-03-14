"use client";

import { useState } from "react";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { Disciplina } from "../_types/disciplina.types";

interface DeleteDisciplinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  disciplina: Disciplina | null;
}

export default function DeleteDisciplinaModal({
  isOpen,
  onClose,
  onConfirm,
  disciplina,
}: DeleteDisciplinaModalProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao excluir disciplina:", error);
    } finally {
      setDeleting(false);
    }
  };

  if (!disciplina) return null;

  const hasAssociations = 
    (disciplina._count?.professores || 0) > 0 || 
    (disciplina._count?.conteudos || 0) > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Excluir Disciplina
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir a disciplina{" "}
              <span className="font-semibold">{disciplina.nome}</span>?
            </p>
            
            {hasAssociations && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                <p className="text-yellow-800 text-sm font-medium">
                  ⚠️ Atenção: Esta disciplina possui:
                </p>
                <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                  {(disciplina._count?.professores || 0) > 0 && (
                    <li>• {disciplina._count?.professores} professor(es) associado(s)</li>
                  )}
                  {(disciplina._count?.conteudos || 0) > 0 && (
                    <li>• {disciplina._count?.conteudos} conteúdo(s) educacional(is)</li>
                  )}
                </ul>
                <p className="text-yellow-800 text-sm mt-2">
                  Todos os dados relacionados serão removidos permanentemente.
                </p>
              </div>
            )}
            
            <p className="text-red-600 font-medium">
              Esta ação não pode ser desfeita.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>
            Cancelar
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Excluir Disciplina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}