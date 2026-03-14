"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { CreateQuestaoData } from "../_types/professor-avaliacao.types";

interface AdicionarQuestaoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  quizId: string;
  quizTitulo: string;
}

interface OpcaoResposta {
  texto: string;
  correta: boolean;
}

export default function AdicionarQuestaoModal({
  open,
  onClose,
  onSuccess,
  quizId,
  quizTitulo
}: AdicionarQuestaoModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateQuestaoData>({
    enunciado: "",
    tipo: "MULTIPLA_ESCOLHA",
    dificuldade: "MEDIO",
    pontos: 1,
    explicacao: ""
  });
  const [opcoes, setOpcoes] = useState<OpcaoResposta[]>([
    { texto: "", correta: false },
    { texto: "", correta: false }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.enunciado.trim()) {
      toast.error("O enunciado da questão é obrigatório");
      return;
    }

    if (formData.pontos <= 0 || formData.pontos > 10) {
      toast.error("A pontuação deve estar entre 0.1 e 10");
      return;
    }

    // Validações específicas por tipo
    if (formData.tipo === "MULTIPLA_ESCOLHA") {
      const opcoesValidas = opcoes.filter(op => op.texto.trim());
      if (opcoesValidas.length < 2) {
        toast.error("Adicione pelo menos 2 opções para questões de múltipla escolha");
        return;
      }
      
      const opcoesCorretas = opcoesValidas.filter(op => op.correta);
      if (opcoesCorretas.length !== 1) {
        toast.error("Marque exatamente uma opção como correta");
        return;
      }
    }

    if (formData.tipo === "VERDADEIRO_FALSO") {
      const opcoesCorretas = opcoes.filter(op => op.correta);
      if (opcoesCorretas.length !== 1) {
        toast.error("Marque uma opção como correta (Verdadeiro ou Falso)");
        return;
      }
    }

    try {
      setLoading(true);
      
      const dataToSubmit = {
        ...formData,
        enunciado: formData.enunciado.trim(),
        explicacao: formData.explicacao?.trim() || undefined,
        opcoes: formData.tipo !== "DISSERTATIVA" ? opcoes.filter(op => op.texto.trim()) : undefined
      };

      await apiRequests.professor.createQuestao(quizId, dataToSubmit);
      onSuccess();
      handleClose();
      toast.success("Questão adicionada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao criar questão:", error);
      toast.error(error.response?.data?.error || "Erro ao criar questão");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        enunciado: "",
        tipo: "MULTIPLA_ESCOLHA",
        dificuldade: "MEDIO",
        pontos: 1,
        explicacao: ""
      });
      setOpcoes([
        { texto: "", correta: false },
        { texto: "", correta: false }
      ]);
      onClose();
    }
  };

  const handleTipoChange = (tipo: string) => {
    setFormData(prev => ({ ...prev, tipo: tipo as any }));
    
    // Resetar opções baseado no tipo
    if (tipo === "VERDADEIRO_FALSO") {
      setOpcoes([
        { texto: "Verdadeiro", correta: false },
        { texto: "Falso", correta: false }
      ]);
    } else if (tipo === "MULTIPLA_ESCOLHA") {
      setOpcoes([
        { texto: "", correta: false },
        { texto: "", correta: false }
      ]);
    } else {
      setOpcoes([]);
    }
  };

  const adicionarOpcao = () => {
    if (opcoes.length < 6) {
      setOpcoes(prev => [...prev, { texto: "", correta: false }]);
    }
  };

  const removerOpcao = (index: number) => {
    if (opcoes.length > 2) {
      setOpcoes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const atualizarOpcao = (index: number, campo: keyof OpcaoResposta, valor: any) => {
    setOpcoes(prev => {
      const novasOpcoes = [...prev];
      
      if (campo === 'correta' && valor && formData.tipo !== "DISSERTATIVA") {
        // Se estamos marcando como correta, desmarcar todas as outras primeiro
        novasOpcoes.forEach((opcao, i) => {
          if (i !== index) {
            opcao.correta = false;
          }
        });
      }
      
      // Atualizar a opção atual
      novasOpcoes[index] = { ...novasOpcoes[index], [campo]: valor };
      
      return novasOpcoes;
    });
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "FACIL":
        return "bg-green-100 text-green-800";
      case "MEDIO":
        return "bg-yellow-100 text-yellow-800";
      case "DIFICIL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Questão</DialogTitle>
          <p className="text-sm text-gray-500">Quiz: {quizTitulo}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enunciado */}
          <div className="space-y-2">
            <Label htmlFor="enunciado">
              Enunciado da Questão <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="enunciado"
              placeholder="Digite o enunciado da questão..."
              value={formData.enunciado}
              onChange={(e) => setFormData(prev => ({ ...prev, enunciado: e.target.value }))}
              disabled={loading}
              rows={4}
              required
            />
          </div>

          {/* Configurações da Questão */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Questão</Label>
              <Select
                value={formData.tipo}
                onValueChange={handleTipoChange}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLA_ESCOLHA">Múltipla Escolha</SelectItem>
                  <SelectItem value="VERDADEIRO_FALSO">Verdadeiro/Falso</SelectItem>
                  <SelectItem value="DISSERTATIVA">Dissertativa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dificuldade">Dificuldade</Label>
              <Select
                value={formData.dificuldade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, dificuldade: value as any }))}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FACIL">
                    <div className="flex items-center gap-2">
                      <Badge className={getDificuldadeColor("FACIL")}>Fácil</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEDIO">
                    <div className="flex items-center gap-2">
                      <Badge className={getDificuldadeColor("MEDIO")}>Médio</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="DIFICIL">
                    <div className="flex items-center gap-2">
                      <Badge className={getDificuldadeColor("DIFICIL")}>Difícil</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pontos">Pontuação</Label>
              <Input
                id="pontos"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={formData.pontos}
                onChange={(e) => setFormData(prev => ({ ...prev, pontos: parseFloat(e.target.value) || 1 }))}
                disabled={loading}
              />
            </div>
          </div>

          {/* Opções de Resposta */}
          {formData.tipo !== "DISSERTATIVA" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Opções de Resposta</Label>
                {formData.tipo === "MULTIPLA_ESCOLHA" && opcoes.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={adicionarOpcao}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Opção
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {opcoes.map((opcao, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={opcao.correta}
                        onCheckedChange={(checked) => atualizarOpcao(index, 'correta', !!checked)}
                        disabled={loading}
                      />
                      <span className="text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                    
                    <Input
                      placeholder={`Opção ${String.fromCharCode(65 + index)}`}
                      value={opcao.texto}
                      onChange={(e) => atualizarOpcao(index, 'texto', e.target.value)}
                      disabled={loading || (formData.tipo === "VERDADEIRO_FALSO")}
                      className="flex-1"
                    />
                    
                    {opcao.correta && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    
                    {formData.tipo === "MULTIPLA_ESCOLHA" && opcoes.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerOpcao(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explicação */}
          <div className="space-y-2">
            <Label htmlFor="explicacao">Explicação (Opcional)</Label>
            <Textarea
              id="explicacao"
              placeholder="Adicione uma explicação que será mostrada após a resposta..."
              value={formData.explicacao}
              onChange={(e) => setFormData(prev => ({ ...prev, explicacao: e.target.value }))}
              disabled={loading}
              rows={3}
            />
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
              {loading ? "Adicionando..." : "Adicionar Questão"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}