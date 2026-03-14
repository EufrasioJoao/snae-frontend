"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { CreateQuizData } from "../_types/professor-avaliacao.types";

interface CriarQuizModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CriarQuizModal({
  open,
  onClose,
  onSuccess
}: CriarQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [formData, setFormData] = useState<CreateQuizData>({
    titulo: "",
    descricao: "",
    disciplinaId: "",
    tempoLimite: undefined,
    notaMinima: undefined,
    tentativasPermitidas: undefined,
    embaralharQuestoes: true,
    mostrarResultado: true,
  });

  useEffect(() => {
    if (open) {
      fetchDisciplinas();
    }
  }, [open]);

  const fetchDisciplinas = async () => {
    try {
      const response = await apiRequests.professor.getDisciplinas({});
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.disciplinaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        titulo: formData.titulo.trim(),
        descricao: formData.descricao?.trim() || undefined,
        tempoLimite: formData.tempoLimite || undefined,
        notaMinima: formData.notaMinima || undefined,
        tentativasPermitidas: formData.tentativasPermitidas || undefined,
      };

      await apiRequests.professor.createQuiz(dataToSubmit);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar quiz:", error);
      toast.error(error.response?.data?.error || "Erro ao criar quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        titulo: "",
        descricao: "",
        disciplinaId: "",
        tempoLimite: undefined,
        notaMinima: undefined,
        tentativasPermitidas: undefined,
        embaralharQuestoes: true,
        mostrarResultado: true,
      });
      onClose();
    }
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Quiz</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título do Quiz <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titulo"
                placeholder="Ex: Avaliação de Matemática - Equações"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o conteúdo e objetivos do quiz..."
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                disabled={loading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disciplina">
                Disciplina <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.disciplinaId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, disciplinaId: value }))}
                disabled={loading}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      <div className="flex flex-col">
                        <span>{disciplina.nome}</span>
                        <span className="text-xs text-gray-500">
                          {formatNivelEnsino(disciplina.nivelEnsino)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Configurações</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tempoLimite">Tempo Limite (minutos)</Label>
                <Input
                  id="tempoLimite"
                  type="number"
                  min="1"
                  max="300"
                  placeholder="Ex: 60"
                  value={formData.tempoLimite || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tempoLimite: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notaMinima">Nota Mínima</Label>
                <Input
                  id="notaMinima"
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  placeholder="Ex: 10"
                  value={formData.notaMinima || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    notaMinima: e.target.value ? parseFloat(e.target.value) : undefined 
                  }))}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tentativasPermitidas">Tentativas Permitidas</Label>
                <Input
                  id="tentativasPermitidas"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Ex: 3"
                  value={formData.tentativasPermitidas || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    tentativasPermitidas: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Opções */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Opções</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="embaralharQuestoes"
                  checked={formData.embaralharQuestoes}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, embaralharQuestoes: !!checked }))
                  }
                  disabled={loading}
                />
                <Label htmlFor="embaralharQuestoes" className="text-sm">
                  Embaralhar questões para cada estudante
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mostrarResultado"
                  checked={formData.mostrarResultado}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, mostrarResultado: !!checked }))
                  }
                  disabled={loading}
                />
                <Label htmlFor="mostrarResultado" className="text-sm">
                  Mostrar resultado imediatamente após conclusão
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Quiz"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}