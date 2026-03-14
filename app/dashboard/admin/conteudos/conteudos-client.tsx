"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ConteudosHeader from "./_components/ConteudosHeader";
import ConteudosStats from "./_components/ConteudosStats";
import ConteudosFilters from "./_components/ConteudosFilters";
import ConteudosTable from "./_components/ConteudosTable";
import ConteudoModal from "./_components/ConteudoModal";

import { ConteudoEducacional, ConteudoStats, ConteudoFilters } from "./_types/conteudo.types";
import api from "@/lib/api-requests";

export default function ConteudosClient() {
  const [conteudos, setConteudos] = useState<ConteudoEducacional[]>([]);
  const [stats, setStats] = useState<ConteudoStats>({
    total: 0,
    aprovados: 0,
    pendentes: 0,
    rejeitados: 0,
    totalVisualizacoes: 0,
    totalDownloads: 0,
    porTipo: {},
    porDisciplina: [],
    maisAcessados: [],
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filters, setFilters] = useState<ConteudoFilters>({
    search: "",
    tipo: "all",
    disciplinaId: "all",
    status: "all",
    page: 1,
    limit: 20,
  });

  const [selectedConteudo, setSelectedConteudo] = useState<ConteudoEducacional | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchConteudos();
  }, [filters]);

  const fetchConteudos = async () => {
    try {
      setLoading(true);
      const response = await api.conteudo.getAll(filters);
      
      if (response.success) {
        setConteudos(response.conteudos);
      } else {
        toast.error("Erro ao carregar conteúdos");
      }
    } catch (error) {
      console.error("Erro ao carregar conteúdos:", error);
      toast.error("Erro ao carregar conteúdos");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.conteudo.getStats();
      
      if (response.success) {
        setStats(response.stats);
      } else {
        toast.error("Erro ao carregar estatísticas");
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleApprove = async (conteudoId: string) => {
    try {
      const response = await api.conteudo.approve(conteudoId);
      
      if (response.success) {
        toast.success("Conteúdo aprovado com sucesso!");
        fetchConteudos();
        fetchStats();
      } else {
        toast.error(response.message || "Erro ao aprovar conteúdo");
      }
    } catch (error) {
      console.error("Erro ao aprovar conteúdo:", error);
      toast.error("Erro ao aprovar conteúdo");
    }
  };

  const handleReject = async (conteudoId: string) => {
    try {
      const response = await api.conteudo.reject(conteudoId);
      
      if (response.success) {
        toast.success("Conteúdo rejeitado");
        fetchConteudos();
        fetchStats();
      } else {
        toast.error(response.message || "Erro ao rejeitar conteúdo");
      }
    } catch (error) {
      console.error("Erro ao rejeitar conteúdo:", error);
      toast.error("Erro ao rejeitar conteúdo");
    }
  };

  const handleView = async (conteudo: ConteudoEducacional) => {
    try {
      // Fetch full content details including presigned URL
      const response = await api.conteudo.getById(conteudo.id);
      setSelectedConteudo(response.conteudo);
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes do conteúdo:", error);
      // Fallback to basic content data
      setSelectedConteudo(conteudo);
      setModalOpen(true);
      toast.error("Erro ao carregar arquivo para download");
    }
  };

  const handleFilterChange = (newFilters: Partial<ConteudoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ConteudosHeader onRefresh={fetchConteudos} />

      {/* Estatísticas */}
      <ConteudosStats stats={stats} loading={statsLoading} />

      {/* Conteúdo Principal */}
      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
          <TabsTrigger value="rejeitados">Rejeitados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardContent>
              <div className="space-y-4">
                <ConteudosFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />

                <ConteudosTable
                  conteudos={conteudos}
                  loading={loading}
                  onView={handleView}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onPageChange={handlePageChange}
                  currentPage={filters.page || 1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardContent>
              <ConteudosTable
                conteudos={conteudos.filter(c => !c.publicado)}
                loading={loading}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onPageChange={handlePageChange}
                currentPage={filters.page || 1}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprovados">
          <Card>
            <CardContent>
              <ConteudosTable
                conteudos={conteudos.filter(c => c.publicado)}
                loading={loading}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onPageChange={handlePageChange}
                currentPage={filters.page || 1}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejeitados">
          <Card>
            <CardContent>
              <ConteudosTable
                conteudos={[]} // TODO: Implementar filtro de rejeitados
                loading={loading}
                onView={handleView}
                onApprove={handleApprove}
                onReject={handleReject}
                onPageChange={handlePageChange}
                currentPage={filters.page || 1}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização */}
      <ConteudoModal
        conteudo={selectedConteudo}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}