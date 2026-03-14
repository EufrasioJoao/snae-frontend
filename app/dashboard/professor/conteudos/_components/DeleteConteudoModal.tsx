"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ConteudoEducacional } from "../../../admin/conteudos/_types/conteudo.types";

interface DeleteConteudoModalProps {
  conteudo: ConteudoEducacional | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteConteudoModal({
  conteudo,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeleteConteudoModalProps) {
  if (!conteudo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Excluir Conteúdo</DialogTitle>
              <DialogDescription>
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Tem certeza que deseja excluir o conteúdo <strong>"{conteudo.titulo}"</strong>?
          </p>

          {conteudo.publicado && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Atenção:</strong> Este conteúdo está aprovado e pode estar sendo usado por estudantes.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}