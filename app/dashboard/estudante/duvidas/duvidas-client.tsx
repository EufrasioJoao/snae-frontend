"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { EstudanteDuvida, EstudanteDuvidasStats as EstudanteDuvidasStatsType, EstudanteDuvidasFilters as EstudanteDuvidasFiltersType } from "./_types/estudante-duvida.types";
import EstudanteDuvidasHeader from "./_components/EstudanteDuvidasHeader";
import EstudanteDuvidasStats from "./_components/EstudanteDuvidasStats";
import EstudanteDuvidasFilters from "./_components/EstudanteDuvidasFilters";
import EstudanteDuvidasTable from "./_components/EstudanteDuvidasTable";
import CriarDuvidaModal from "./_components/CriarDuvidaModal";
import DuvidaModal from "./_components/DuvidaModal";

export default function EstudanteDuvidasClient() {
  const [duvidas, setDuvidas] = useState<EstudanteDuvida[]>([]);
  const [stats, setStats] = useState<EstudanteDuvidasStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("todas");
  const [filters, setFilters] = useState<EstudanteDuvidasFiltersType>({
    search: "",
    status: "TODAS",
    disciplinaId: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [selectedDuvida, setSelectedDuvida] = useState<EstudanteDuvida | null>(null);

  const fetchDuvidas = async (page = 1) => {
    try {
      setRefreshing(true);
      
      const params: any = {
        page,
        limit: pagination.limit,
        search: filters.search || undefined,
        disciplinaId: filters.disciplinaId || undefined
      };

      // Aplicar filtro de status baseado na aba ativa
      if (activeTab !== "todas") {
        params.status = activeTab.toUpperCase();
      }

      const response = await apiRequests.estudante.getDuvidas(params);
      
      setDuvidas(response.duvidas);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Erro ao carregar dúvidas:", error);
      toast.error("Erro ao carregar dúvidas");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequests.estudante.getDuvidasStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchDuvidas(1), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchDuvidas(1);
  }, [activeTab, filters]);

  const handleRefresh = () => {
    loadData();
  };

  const handlePageChange = (page: number) => {
    fetchDuvidas(page);
  };

  const handleFilterChange = (newFilters: Partial<EstudanteDuvidasFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleCriarDuvida = () => {
    setShowCriarModal(true);
  };

  const handleDuvidaCriada = () => {
    setShowCriarModal(false);
    loadData();
    toast.success("Dúvida criada com sucesso!");
  };

  const handleViewDuvida = (duvida: EstudanteDuvida) => {
    setSelectedDuvida(duvida);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EstudanteDuvidasHeader 
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {stats && <EstudanteDuvidasStats stats={stats} />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Minhas Dúvidas</CardTitle>
          <Button onClick={handleCriarDuvida}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Dúvida
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todas">
                Todas ({stats?.total || 0})
              </TabsTrigger>
              <TabsTrigger value="pendente">
                Pendentes ({stats?.pendentes || 0})
              </TabsTrigger>
              <TabsTrigger value="respondida">
                Respondidas ({stats?.respondidas || 0})
              </TabsTrigger>
              <TabsTrigger value="fechada">
                Fechadas ({stats?.fechadas || 0})
              </TabsTrigger>
            </TabsList>

            <EstudanteDuvidasFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <TabsContent value={activeTab} className="space-y-4">
              <EstudanteDuvidasTable
                duvidas={duvidas}
                loading={refreshing}
                pagination={pagination}
                onPageChange={handlePageChange}
                onView={handleViewDuvida}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {showCriarModal && (
        <CriarDuvidaModal
          open={showCriarModal}
          onClose={() => setShowCriarModal(false)}
          onSuccess={handleDuvidaCriada}
        />
      )}

      {selectedDuvida && (
        <DuvidaModal
          duvida={selectedDuvida}
          open={!!selectedDuvida}
          onClose={() => setSelectedDuvida(null)}
        />
      )}
    </div>
  );
}