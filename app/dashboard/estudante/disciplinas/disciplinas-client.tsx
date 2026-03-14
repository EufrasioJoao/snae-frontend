"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw, BookOpen } from "lucide-react";

// Components
import EstudanteDisciplinasHeader from "./_components/EstudanteDisciplinasHeader";
import EstudanteDisciplinasStats from "./_components/EstudanteDisciplinasStats";
import EstudanteDisciplinasTable from "./_components/EstudanteDisciplinasTable";
import AssociarDisciplinasModal from "./_components/AssociarDisciplinasModal";

// Types
import { EstudanteDisciplina, EstudanteDisciplinasStats as StatsType } from "./_types/estudante-disciplina.types";
import api from "@/lib/api-requests";

export default function DisciplinasClient() {
  const router = useRouter();
  const [disciplinas, setDisciplinas] = useState<EstudanteDisciplina[]>([]);
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    primario: 0,
    secundario: 0,
    porArea: [],
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [associarModalOpen, setAssociarModalOpen] = useState(false);

  useEffect(() => {
    fetchDisciplinas();
    fetchStats();
  }, []);

  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const response = await api.estudante.getDisciplinas();
      setDisciplinas(response.disciplinas || []);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.estudante.getDisciplinasStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleAssociar = () => {
    setAssociarModalOpen(true);
  };

  const handleAssociacaoSuccess = () => {
    setAssociarModalOpen(false);
    fetchDisciplinas();
    fetchStats();
    toast.success("Disciplinas associadas com sucesso!");
  };

  const handleDesassociar = async (disciplinaId: string) => {
    try {
      await api.estudante.desassociarDisciplina(disciplinaId);
      toast.success("Disciplina removida com sucesso!");
      fetchDisciplinas();
      fetchStats();
    } catch (error) {
      console.error("Erro ao remover disciplina:", error);
      toast.error("Erro ao remover disciplina");
    }
  };

  const handleRefresh = () => {
    fetchDisciplinas();
    fetchStats();
  };

  const disciplinasPrimario = disciplinas.filter(d => d.disciplina.nivelEnsino === "ENSINO_PRIMARIO");
  const disciplinasSecundario = disciplinas.filter(d => d.disciplina.nivelEnsino === "ENSINO_SECUNDARIO");

  return (
    <div className="space-y-6">
      {/* Header */}
      <EstudanteDisciplinasHeader 
        onAssociar={handleAssociar}
        onRefresh={handleRefresh}
      />

      {/* Stats */}
      <EstudanteDisciplinasStats stats={stats} loading={statsLoading} />

      {/* Content */}
      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todas">Todas ({stats.total})</TabsTrigger>
          <TabsTrigger value="primario">Ensino Primário ({stats.primario})</TabsTrigger>
          <TabsTrigger value="secundario">Ensino Secundário ({stats.secundario})</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card>
            <CardContent className="pt-6">
              {disciplinas.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma disciplina associada
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Você ainda não se associou a nenhuma disciplina.
                  </p>
                  <Button onClick={handleAssociar}>
                    <Plus className="w-4 h-4 mr-2" />
                    Associar Disciplinas
                  </Button>
                </div>
              ) : (
                <EstudanteDisciplinasTable
                  disciplinas={disciplinas}
                  loading={loading}
                  onDesassociar={handleDesassociar}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="primario">
          <Card>
            <CardContent className="pt-6">
              <EstudanteDisciplinasTable
                disciplinas={disciplinasPrimario}
                loading={loading}
                onDesassociar={handleDesassociar}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secundario">
          <Card>
            <CardContent className="pt-6">
              <EstudanteDisciplinasTable
                disciplinas={disciplinasSecundario}
                loading={loading}
                onDesassociar={handleDesassociar}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <AssociarDisciplinasModal
        isOpen={associarModalOpen}
        onClose={() => setAssociarModalOpen(false)}
        onSuccess={handleAssociacaoSuccess}
      />
    </div>
  );
}