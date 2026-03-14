"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

import DisciplinasHeader from "./_components/DisciplinasHeader";
import DisciplinasStats from "./_components/DisciplinasStats";
import DisciplinasFilters from "./_components/DisciplinasFilters";
import DisciplinasTable from "./_components/DisciplinasTable";

import { 
  ProfessorDisciplina, 
  ProfessorDisciplinaStats, 
  DisciplinaFilters 
} from "./_types/professor-disciplina.types";
import api from "@/lib/api-requests";

export default function DisciplinasClient() {
  const router = useRouter();
  const [disciplinas, setDisciplinas] = useState<ProfessorDisciplina[]>([]);
  const [stats, setStats] = useState<ProfessorDisciplinaStats>({
    totalDisciplinas: 0,
    totalEstudantes: 0,
    totalConteudos: 0,
    totalDuvidas: 0,
    duvidasPendentes: 0,
    conteudosPendentes: 0,
    disciplinasMaisAtivas: [],
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState<DisciplinaFilters>({
    search: "",
    nivelEnsino: "all",
    areaId: "all",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchDisciplinas();
  }, [filters]);

  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const response = await api.professor.getDisciplinas(filters);
      setDisciplinas(response.disciplinas);
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
      const response = await api.professor.getDisciplinasStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleViewDisciplina = (disciplina: ProfessorDisciplina) => {
    // TODO: Implementar modal ou página de detalhes da disciplina
    toast.info(`Visualizando ${disciplina.nome}`);
  };

  const handleCreateContent = (disciplinaId?: string) => {
    // Redirecionar para página de criação de conteúdo
    const url = disciplinaId 
      ? `/dashboard/professor/conteudos/criar?disciplina=${disciplinaId}`
      : `/dashboard/professor/conteudos/criar`;
    router.push(url);
  };

  const handleViewDuvidas = (disciplinaId: string) => {
    // Redirecionar para página de dúvidas da disciplina
    router.push(`/dashboard/professor/duvidas?disciplina=${disciplinaId}`);
  };

  const handleFilterChange = (newFilters: Partial<DisciplinaFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DisciplinasHeader 
        onRefresh={fetchDisciplinas}
        onCreateContent={() => handleCreateContent()}
        loading={loading}
      />

      {/* Estatísticas */}
      <DisciplinasStats stats={stats} loading={statsLoading} />

      {/* Lista de Disciplinas */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <DisciplinasFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <DisciplinasTable
              disciplinas={disciplinas}
              loading={loading}
              onViewDisciplina={handleViewDisciplina}
              onCreateContent={handleCreateContent}
              onViewDuvidas={handleViewDuvidas}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}