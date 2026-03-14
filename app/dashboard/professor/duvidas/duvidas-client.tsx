"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DuvidasHeader from "./_components/DuvidasHeader";
import DuvidasStats from "./_components/DuvidasStats";
import DuvidasTable from "./_components/DuvidasTable";
import DuvidaModal from "./_components/DuvidaModal";

import { 
  Duvida, 
  DuvidaStats, 
  DuvidaFilters 
} from "./_types/professor-duvida.types";
import api from "@/lib/api-requests";

export default function DuvidasClient() {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [stats, setStats] = useState<DuvidaStats>({
    totalDuvidas: 0,
    duvidasPendentes: 0,
    duvidasRespondidas: 0,
    duvidasFechadas: 0,
    tempoMedioResposta: 0,
    minhasRespostas: 0,
    melhorResposta: 0,
    porDisciplina: [],
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedDuvida, setSelectedDuvida] = useState<Duvida | null>(null);
  const [filters, setFilters] = useState<DuvidaFilters>({
    search: "",
    disciplinaId: "all",
    status: "all",
    page: 1,
    limit: 20,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchDuvidas();
  }, [filters]);

  const fetchDuvidas = async () => {
    try {
      setLoading(true);
      const response = await api.professor.getDuvidas(filters);
      setDuvidas(response.duvidas);
    } catch (error) {
      console.error("Erro ao carregar dúvidas:", error);
      toast.error("Erro ao carregar dúvidas");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.professor.getDuvidasStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleViewDuvida = (duvida: Duvida) => {
    setSelectedDuvida(duvida);
  };

  const handleResponder = (duvidaId: string) => {
    const duvida = duvidas.find(d => d.id === duvidaId);
    if (duvida) {
      setSelectedDuvida(duvida);
    }
  };

  const handleModalSuccess = () => {
    fetchDuvidas();
    fetchStats();
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DuvidasHeader 
        onRefresh={fetchDuvidas}
        loading={loading}
        totalPendentes={stats.duvidasPendentes}
      />

      {/* Estatísticas */}
      <DuvidasStats stats={stats} loading={statsLoading} />

      {/* Conteúdo Principal */}
      <Tabs defaultValue="todas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="pendentes">
            Pendentes ({stats.duvidasPendentes})
          </TabsTrigger>
          <TabsTrigger value="respondidas">Respondidas</TabsTrigger>
          <TabsTrigger value="fechadas">Fechadas</TabsTrigger>
        </TabsList>

        <TabsContent value="todas">
          <Card>
            <CardContent className="pt-6">
              <DuvidasTable
                duvidas={duvidas}
                loading={loading}
                onViewDuvida={handleViewDuvida}
                onResponder={handleResponder}
                currentPage={filters.page || 1}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardContent className="pt-6">
              <DuvidasTable
                duvidas={duvidas.filter(d => d.status === "PENDENTE")}
                loading={loading}
                onViewDuvida={handleViewDuvida}
                onResponder={handleResponder}
                currentPage={filters.page || 1}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="respondidas">
          <Card>
            <CardContent className="pt-6">
              <DuvidasTable
                duvidas={duvidas.filter(d => d.status === "RESPONDIDA")}
                loading={loading}
                onViewDuvida={handleViewDuvida}
                onResponder={handleResponder}
                currentPage={filters.page || 1}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fechadas">
          <Card>
            <CardContent className="pt-6">
              <DuvidasTable
                duvidas={duvidas.filter(d => d.status === "FECHADA")}
                loading={loading}
                onViewDuvida={handleViewDuvida}
                onResponder={handleResponder}
                currentPage={filters.page || 1}
                onPageChange={handlePageChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Dúvida */}
      <DuvidaModal
        duvida={selectedDuvida}
        open={!!selectedDuvida}
        onClose={() => setSelectedDuvida(null)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}