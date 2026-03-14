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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { CreateDuvidaData, Topico } from "../_types/estudante-duvida.types";

interface CriarDuvidaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CriarDuvidaModal({
  open,
  onClose,
  onSuccess
}: CriarDuvidaModalProps) {
  const [loading, setLoading] = useState(false);
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [loadingTopicos, setLoadingTopicos] = useState(false);
  const [formData, setFormData] = useState<CreateDuvidaData>({
    titulo: "",
    descricao: "",
    disciplinaId: "",
    topicoId: "none"
  });

  useEffect(() => {
    if (open) {
      fetchDisciplinas();
    }
  }, [open]);

  useEffect(() => {
    if (formData.disciplinaId) {
      fetchTopicos(formData.disciplinaId);
    } else {
      setTopicos([]);
    }
  }, [formData.disciplinaId]);

  const fetchDisciplinas = async () => {
    try {
      const response = await apiRequests.estudante.getDisciplinasDisponiveis();
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    }
  };

  const fetchTopicos = async (disciplinaId: string) => {
    try {
      setLoadingTopicos(true);
      const response = await apiRequests.estudante.getTopicosByDisciplina(disciplinaId);
      setTopicos(response);
    } catch (error) {
      console.error("Erro ao carregar tópicos:", error);
      setTopicos([]);
    } finally {
      setLoadingTopicos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.descricao.trim() || !formData.disciplinaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      
      const dataToSubmit = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        disciplinaId: formData.disciplinaId,
        topicoId: formData.topicoId && formData.topicoId !== "none" ? formData.topicoId : undefined
      };

      await apiRequests.estudante.createDuvida(dataToSubmit);
      onSuccess();
    } catch (error: any) {
      console.error("Erro ao criar dúvida:", error);
      toast.error(error.response?.data?.error || "Erro ao criar dúvida");
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
        topicoId: "none"
      });
      setTopicos([]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Dúvida</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">
              Título da Dúvida <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titulo"
              placeholder="Ex: Como resolver equações do segundo grau?"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disciplina">
              Disciplina <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.disciplinaId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, disciplinaId: value, topicoId: "none" }))}
              disabled={loading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {/* Disciplinas do Ensino Primário */}
                {disciplinas.filter(d => d.nivelEnsino === "ENSINO_PRIMARIO").length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 -mx-1">
                      Ensino Primário (1ª-7ª classe)
                    </div>
                    {disciplinas
                      .filter(d => d.nivelEnsino === "ENSINO_PRIMARIO")
                      .map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome}
                        </SelectItem>
                      ))}
                  </>
                )}
                
                {/* Disciplinas do Ensino Secundário */}
                {disciplinas.filter(d => d.nivelEnsino === "ENSINO_SECUNDARIO").length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 -mx-1">
                      Ensino Secundário (8ª-12ª classe)
                    </div>
                    {disciplinas
                      .filter(d => d.nivelEnsino === "ENSINO_SECUNDARIO")
                      .map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome}
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {formData.disciplinaId && (
            <div className="space-y-2">
              <Label htmlFor="topico">Tópico (Opcional)</Label>
              <Select
                value={formData.topicoId || "none"}
                onValueChange={(value) => setFormData(prev => ({ ...prev, topicoId: value === "none" ? "" : value }))}
                disabled={loading || loadingTopicos}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingTopicos ? "Carregando tópicos..." : "Selecione um tópico (opcional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum tópico específico</SelectItem>
                  {topicos.map((topico) => (
                    <SelectItem key={topico.id} value={topico.id}>
                      {topico.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="descricao">
              Descrição da Dúvida <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descricao"
              placeholder="Descreva sua dúvida em detalhes. Quanto mais informações você fornecer, melhor será a resposta que receberá."
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              disabled={loading}
              rows={6}
              required
            />
            <p className="text-xs text-gray-500">
              Seja específico sobre o que não entende e inclua exemplos se possível.
            </p>
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
              {loading ? "Criando..." : "Criar Dúvida"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}