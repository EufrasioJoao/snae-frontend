"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { AreaConhecimento } from "../_types/disciplina.types";

interface CreateAreaData {
  nome: string;
  descricao?: string;
  icone?: string;
  cor?: string;
}

interface AreaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAreaData) => Promise<void>;
  area?: AreaConhecimento | null;
  loading?: boolean;
}

const iconesDisponiveis = [
  "📝", "🔢", "🔬", "🌍", "⚽", "🎨", "🎵", "🤝",
  "📚", "💻", "🧪", "🎭", "🏛️", "🌱", "🔧", "📊"
];

const coresDisponiveis = [
  "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444",
  "#EC4899", "#06B6D4", "#84CC16", "#6366F1", "#F97316"
];

export default function AreaModal({
  isOpen,
  onClose,
  onSubmit,
  area,
  loading = false,
}: AreaModalProps) {
  const [formData, setFormData] = useState<CreateAreaData>({
    nome: "",
    descricao: "",
    icone: "📚",
    cor: "#3B82F6",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!area;

  useEffect(() => {
    if (area) {
      setFormData({
        nome: area.nome,
        descricao: area.descricao || "",
        icone: area.icone || "📚",
        cor: area.cor || "#3B82F6",
      });
    } else {
      setFormData({
        nome: "",
        descricao: "",
        icone: "📚",
        cor: "#3B82F6",
      });
    }
    setErrors({});
  }, [area, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da área é obrigatório";
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
      console.error("Erro ao salvar área:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateAreaData, value: string) => {
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
            {isEditing ? "Editar Área de Conhecimento" : "Nova Área de Conhecimento"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Área *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Ciências da Computação"
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
              placeholder="Descrição da área de conhecimento (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Ícone</Label>
            <div className="grid grid-cols-8 gap-2">
              {iconesDisponiveis.map((icone) => (
                <button
                  key={icone}
                  type="button"
                  onClick={() => handleInputChange("icone", icone)}
                  className={`p-2 text-xl border rounded hover:bg-gray-50 ${
                    formData.icone === icone ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  {icone}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="grid grid-cols-5 gap-2">
              {coresDisponiveis.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => handleInputChange("cor", cor)}
                  className={`w-8 h-8 rounded border-2 ${
                    formData.cor === cor ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: cor }}
                  title={cor}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span>Cor selecionada:</span>
              <div
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: formData.cor }}
              />
              <span className="text-sm text-gray-600">{formData.cor}</span>
            </div>
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