"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { ConteudoBiblioteca, ConteudoDetalhado, BibliotecaStats as BibliotecaStatsType, BibliotecaFilters as BibliotecaFiltersType } from "./_types/biblioteca.types";
import BibliotecaHeader from "./_components/BibliotecaHeader";
import BibliotecaStats from "./_components/BibliotecaStats";
import BibliotecaFilters from "./_components/BibliotecaFilters";
import ConteudosGrid from "./_components/ConteudosGrid";
import ConteudoModal from "./_components/ConteudoModal";

export default function BibliotecaClient() {
  const [conteudos, setConteudos] = useState<ConteudoBiblioteca[]>([]);
  const [stats, setStats] = useState<BibliotecaStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<BibliotecaFiltersType>({
    search: "",
    disciplinaId: "",
    tipo: "TODOS"
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [selectedConteudo, setSelectedConteudo] = useState<ConteudoBiblioteca | ConteudoDetalhado | null>(null);

  const fetchConteudos = async (page = 1) => {
    try {
      setRefreshing(true);
      
      const params: any = {
        page,
        limit: pagination.limit,
        search: filters.search || undefined,
        disciplinaId: filters.disciplinaId || undefined,
        tipo: filters.tipo !== "TODOS" ? filters.tipo : undefined
      };

      const response = await apiRequests.estudante.getBiblioteca(params);
      
      setConteudos(response.conteudos);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Erro ao carregar biblioteca:", error);
      toast.error("Erro ao carregar conteúdos");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequests.estudante.getBibliotecaStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchConteudos(1), fetchStats()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    fetchConteudos(1);
  }, [filters]);

  const handleRefresh = () => {
    loadData();
  };

  const handlePageChange = (page: number) => {
    fetchConteudos(page);
  };

  const handleFilterChange = (newFilters: Partial<BibliotecaFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleViewConteudo = (conteudo: ConteudoBiblioteca | ConteudoDetalhado) => {
    setSelectedConteudo(conteudo);
  };

  const handleOpenConteudo = (conteudo: ConteudoBiblioteca | ConteudoDetalhado) => {
    if ('urlDownload' in conteudo && conteudo.urlDownload) {
      window.open(conteudo.urlDownload, '_blank');
    } else {
      toast.error("Arquivo não disponível para visualização");
    }
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
      <BibliotecaHeader 
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {stats && <BibliotecaStats stats={stats} />}

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca Digital</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <BibliotecaFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            <ConteudosGrid
              conteudos={conteudos}
              loading={refreshing}
              pagination={pagination}
              onPageChange={handlePageChange}
              onView={handleViewConteudo}
              onOpen={handleOpenConteudo}
            />
          </div>
        </CardContent>
      </Card>

      {selectedConteudo && (
        <ConteudoModal
          conteudo={selectedConteudo}
          open={!!selectedConteudo}
          onClose={() => setSelectedConteudo(null)}
        />
      )}
    </div>
  );
}