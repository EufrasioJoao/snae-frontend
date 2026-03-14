"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { DisciplinaDisponivel } from "../_types/estudante-disciplina.types";
import api from "@/lib/api-requests";

interface AssociarDisciplinasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssociarDisciplinasModal({
  isOpen,
  onClose,
  onSuccess,
}: AssociarDisciplinasModalProps) {
  const [disciplinas, setDisciplinas] = useState<DisciplinaDisponivel[]>([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<DisciplinaDisponivel[]>([]);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDisciplinas();
    }
  }, [isOpen]);

  useEffect(() => {
    filterDisciplinas();
  }, [disciplinas, searchTerm]);

  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const response = await api.estudante.getDisciplinasDisponiveis();
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas disponíveis");
    } finally {
      setLoading(false);
    }
  };

  const filterDisciplinas = () => {
    let filtered = disciplinas;

    if (searchTerm) {
      filtered = filtered.filter(disciplina =>
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disciplina.areaConhecimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDisciplinas(filtered);
  };

  const handleDisciplinaToggle = (disciplinaId: string) => {
    setSelectedDisciplinas(prev => {
      if (prev.includes(disciplinaId)) {
        return prev.filter(id => id !== disciplinaId);
      } else {
        return [...prev, disciplinaId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedDisciplinas.length === 0) {
      toast.error("Selecione pelo menos uma disciplina");
      return;
    }

    try {
      setSubmitting(true);
      await api.estudante.associarDisciplinas(selectedDisciplinas);
      onSuccess();
      setSelectedDisciplinas([]);
      setSearchTerm("");
    } catch (error) {
      console.error("Erro ao associar disciplinas:", error);
      toast.error("Erro ao associar disciplinas");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedDisciplinas([]);
    setSearchTerm("");
    onClose();
  };

  const disciplinasPrimario = filteredDisciplinas.filter(d => d.nivelEnsino === "ENSINO_PRIMARIO");
  const disciplinasSecundario = filteredDisciplinas.filter(d => d.nivelEnsino === "ENSINO_SECUNDARIO");
  const disciplinasDisponiveis = filteredDisciplinas.filter(d => !d.jaAssociada);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Associar Disciplinas</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col space-y-4">
          {/* Search */}
          <div className="flex-shrink-0 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar disciplinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Carregando disciplinas...
              </div>
            ) : (
              <Tabs defaultValue="todas" className="h-full flex flex-col">
                <TabsList className="flex-shrink-0">
                  <TabsTrigger value="todas">
                    Todas ({disciplinasDisponiveis.length})
                  </TabsTrigger>
                  <TabsTrigger value="primario">
                    Ensino Primário ({disciplinasPrimario.filter(d => !d.jaAssociada).length})
                  </TabsTrigger>
                  <TabsTrigger value="secundario">
                    Ensino Secundário ({disciplinasSecundario.filter(d => !d.jaAssociada).length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 min-h-0 overflow-y-auto mt-4">
                  <TabsContent value="todas" className="mt-0 h-full">
                    <DisciplinasList
                      disciplinas={disciplinasDisponiveis}
                      selectedDisciplinas={selectedDisciplinas}
                      onToggle={handleDisciplinaToggle}
                    />
                  </TabsContent>

                  <TabsContent value="primario" className="mt-0 h-full">
                    <DisciplinasList
                      disciplinas={disciplinasPrimario.filter(d => !d.jaAssociada)}
                      selectedDisciplinas={selectedDisciplinas}
                      onToggle={handleDisciplinaToggle}
                    />
                  </TabsContent>

                  <TabsContent value="secundario" className="mt-0 h-full">
                    <DisciplinasList
                      disciplinas={disciplinasSecundario.filter(d => !d.jaAssociada)}
                      selectedDisciplinas={selectedDisciplinas}
                      onToggle={handleDisciplinaToggle}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            )}
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {selectedDisciplinas.length} disciplina(s) selecionada(s)
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={selectedDisciplinas.length === 0 || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Associando...
                  </>
                ) : (
                  `Associar ${selectedDisciplinas.length} Disciplina(s)`
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DisciplinasListProps {
  disciplinas: DisciplinaDisponivel[];
  selectedDisciplinas: string[];
  onToggle: (disciplinaId: string) => void;
}

function DisciplinasList({ disciplinas, selectedDisciplinas, onToggle }: DisciplinasListProps) {
  if (disciplinas.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma disciplina encontrada
        </h3>
        <p className="text-gray-500">
          Todas as disciplinas desta categoria já estão associadas ou não há disciplinas disponíveis.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {disciplinas.map((disciplina) => {
        const isSelected = selectedDisciplinas.includes(disciplina.id);
        const isAssociated = disciplina.jaAssociada;

        return (
          <div
            key={disciplina.id}
            className={`border rounded-lg p-4 transition-colors ${
              isAssociated 
                ? "bg-green-50 border-green-200" 
                : isSelected 
                ? "bg-blue-50 border-blue-200" 
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {isAssociated ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(disciplina.id)}
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {disciplina.nome}
                    </h3>
                    {disciplina.descricao && (
                      <p className="text-sm text-gray-600 mb-2">
                        {disciplina.descricao}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {disciplina.nivelEnsino === "ENSINO_PRIMARIO" 
                          ? "Ensino Primário" 
                          : "Ensino Secundário"}
                      </Badge>
                      <Badge variant="outline">
                        {disciplina.areaConhecimento.nome}
                      </Badge>
                      {isAssociated && (
                        <Badge variant="default">
                          Já Associada
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}