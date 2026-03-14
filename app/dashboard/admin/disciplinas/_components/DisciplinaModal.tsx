"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Disciplina, AreaConhecimento, CreateDisciplinaData } from "../_types/disciplina.types";

interface DisciplinaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDisciplinaData) => Promise<void>;
  disciplina?: Disciplina | null;
  areas: AreaConhecimento[];
  loading?: boolean;
}

export default function DisciplinaModal({
  isOpen,
  onClose,
  onSubmit,
  disciplina,
  areas,
  loading = false,
}: DisciplinaModalProps) {
  const [formData, setFormData] = useState<CreateDisciplinaData>({
    nome: "",
    descricao: "",
    nivelEnsino: "ENSINO_PRIMARIO",
    areaConhecimentoId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!disciplina;

  useEffect(() => {
    if (disciplina) {
      setFormData({
        nome: disciplina.nome,
        descricao: disciplina.descricao || "",
        nivelEnsino: disciplina.nivelEnsino,
        areaConhecimentoId: disciplina.areaConhecimentoId,
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        nivelEnsino: "ENSINO_PRIMARIO",
        areaConhecimentoId: "",
      });
    }
    setErrors({});
  }, [disciplina, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da disciplina é obrigatório";
    }

    if (!formData.areaConhecimentoId) {
      newErrors.areaConhecimentoId = "Área de conhecimento é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar disciplina:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateDisciplinaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Disciplina" : "Nova Disciplina"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Disciplina *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Matemática"
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Descrição da disciplina (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nivelEnsino">Nível de Ensino *</Label>
            <Select
              value={formData.nivelEnsino}
              onValueChange={(value) => handleInputChange("nivelEnsino", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENSINO_PRIMARIO">Ensino Primário</SelectItem>
                <SelectItem value="ENSINO_SECUNDARIO">Ensino Secundário</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="areaConhecimento">Área de Conhecimento *</Label>
            <Select
              value={formData.areaConhecimentoId}
              onValueChange={(value) => handleInputChange("areaConhecimentoId", value)}
            >
              <SelectTrigger className={errors.areaConhecimentoId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.areaConhecimentoId && (
              <p className="text-sm text-red-600">{errors.areaConhecimentoId}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}