"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, BookOpen, Save, Users } from "lucide-react";
import api from "@/lib/api-requests";

interface Disciplina {
  id: string;
  nome: string;
  nivelEnsino: string;
  areaConhecimento: {
    id: string;
    nome: string;
  };
}

export default function AssociarDisciplinasClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinasAssociadas, setDisciplinasAssociadas] = useState<string[]>([]);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<Disciplina[]>([]);

  useEffect(() => {
    fetchDisciplinas();
    fetchDisciplinasAssociadas();
  }, []);

  useEffect(() => {
    const filtered = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.areaConhecimento.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplinas(filtered);
  }, [disciplinas, searchTerm]);

  const fetchDisciplinas = async () => {
    try {
      const response = await api.disciplina.getAll();
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    }
  };

  const fetchDisciplinasAssociadas = async () => {
    try {
      const response = await api.professor.getDisciplinas();
      const associadas = response.disciplinas?.map((d: any) => d.id) || [];
      setDisciplinasAssociadas(associadas);
      setSelectedDisciplinas(associadas);
    } catch (error) {
      console.error("Erro ao carregar disciplinas associadas:", error);
    }
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

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.professor.associateDisciplinas({ disciplinaIds: selectedDisciplinas });
      toast.success("Disciplinas associadas com sucesso!");
      router.push("/dashboard/professor/disciplinas");
    } catch (error) {
      console.error("Erro ao associar disciplinas:", error);
      toast.error("Erro ao associar disciplinas");
    } finally {
      setLoading(false);
    }
  };

  const getNivelEnsinoLabel = (nivel: string) => {
    switch (nivel) {
      case "ENSINO_PRIMARIO":
        return "Ensino Primário";
      case "ENSINO_SECUNDARIO":
        return "Ensino Secundário";
      default:
        return nivel;
    }
  };

  const getNivelEnsinoColor = (nivel: string) => {
    switch (nivel) {
      case "ENSINO_PRIMARIO":
        return "bg-blue-100 text-blue-800";
      case "ENSINO_SECUNDARIO":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Associar Disciplinas</h1>
          <p className="text-gray-600">
            Selecione as disciplinas que você leciona para poder criar conteúdos
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Disponível</p>
                <p className="text-xl font-bold">{disciplinas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Já Associadas</p>
                <p className="text-xl font-bold">{disciplinasAssociadas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Save className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selecionadas</p>
                <p className="text-xl font-bold">{selectedDisciplinas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Disciplinas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar disciplinas por nome ou área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredDisciplinas.map((disciplina) => (
              <div
                key={disciplina.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDisciplinas.includes(disciplina.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDisciplinaToggle(disciplina.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedDisciplinas.includes(disciplina.id)}
                    onChange={() => handleDisciplinaToggle(disciplina.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {disciplina.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {disciplina.areaConhecimento.nome}
                    </p>
                    <Badge
                      className={`text-xs ${getNivelEnsinoColor(disciplina.nivelEnsino)}`}
                    >
                      {getNivelEnsinoLabel(disciplina.nivelEnsino)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDisciplinas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma disciplina encontrada</p>
              {searchTerm && (
                <p className="text-sm">Tente buscar com outros termos</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={loading || selectedDisciplinas.length === 0}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? "Salvando..." : "Salvar Associações"}
        </Button>
      </div>
    </div>
  );
}