"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api-requests";

import DisciplinasHeader from "./_components/DisciplinasHeader";
import DisciplinasStats from "./_components/DisciplinasStats";
import DisciplinasFilters from "./_components/DisciplinasFilters";
import DisciplinasTable from "./_components/DisciplinasTable";
import DisciplinaModal from "./_components/DisciplinaModal";
import DeleteDisciplinaModal from "./_components/DeleteDisciplinaModal";
import AreaModal from "./_components/AreaModal";
import DisciplinasPagination from "./_components/DisciplinasPagination";

import { 
  Disciplina, 
  AreaConhecimento, 
  DisciplinaStats, 
  CreateDisciplinaData,
  PaginationInfo 
} from "./_types/disciplina.types";

export default function DisciplinasClient() {
  // Estados principais
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [areas, setAreas] = useState<AreaConhecimento[]>([]);
  const [stats, setStats] = useState<DisciplinaStats>({
    total: 0,
    primario: 0,
    secundario: 0,
    areasConhecimento: 0,
    professoresAssociados: 0,
    conteudosTotal: 0,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Estados de loading
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [nivelFilter, setNivelFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");

  // Estados de modais
  const [disciplinaModal, setDisciplinaModal] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingDisciplina, setDeletingDisciplina] = useState<Disciplina | null>(null);
  const [areaModal, setAreaModal] = useState(false);

  // Carregar dados iniciais
  useEffect(() => {
    fetchAreas();
    fetchStats();
  }, []);

  // Carregar disciplinas quando filtros mudam
  useEffect(() => {
    fetchDisciplinas();
  }, [searchTerm, nivelFilter, areaFilter, pagination.page, pagination.limit]);

  // Funções de fetch
  const fetchDisciplinas = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (nivelFilter !== "all") params.nivelEnsino = nivelFilter;
      if (areaFilter !== "all") params.areaConhecimentoId = areaFilter;

      const response = await api.disciplina.getAll(params);
      
      if (response.success) {
        setDisciplinas(response.disciplinas);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    } finally {
      setLoading(false);
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await api.disciplina.getAreas();
      
      if (response.success) {
        setAreas(response.areas);
      }
    } catch (error) {
      console.error("Erro ao carregar áreas:", error);
      toast.error("Erro ao carregar áreas de conhecimento");
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.disciplina.getStats();
      
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  // Handlers de CRUD
  const handleCreateDisciplina = async (data: CreateDisciplinaData) => {
    try {
      const response = await api.disciplina.create(data);
      
      if (response.success) {
        toast.success("Disciplina criada com sucesso!");
        fetchDisciplinas();
        fetchStats();
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao criar disciplina";
      toast.error(message);
      throw error;
    }
  };

  const handleCreateArea = async (data: any) => {
    try {
      const response = await api.disciplina.createArea(data);
      
      if (response.success) {
        toast.success("Área de conhecimento criada com sucesso!");
        fetchAreas();
        fetchStats();
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao criar área de conhecimento";
      toast.error(message);
      throw error;
    }
  };

  const handleUpdateDisciplina = async (data: CreateDisciplinaData) => {
    if (!editingDisciplina) return;

    try {
      const response = await api.disciplina.update(editingDisciplina.id, data);
      
      if (response.success) {
        toast.success("Disciplina atualizada com sucesso!");
        fetchDisciplinas();
        fetchStats();
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao atualizar disciplina";
      toast.error(message);
      throw error;
    }
  };

  const handleDeleteDisciplina = async () => {
    if (!deletingDisciplina) return;

    try {
      const response = await api.disciplina.delete(deletingDisciplina.id);
      
      if (response.success) {
        toast.success("Disciplina excluída com sucesso!");
        fetchDisciplinas();
        fetchStats();
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Erro ao excluir disciplina";
      toast.error(message);
      throw error;
    }
  };

  // Handlers de modais
  const openCreateModal = () => {
    setEditingDisciplina(null);
    setDisciplinaModal(true);
  };

  const openEditModal = (disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setDisciplinaModal(true);
  };

  const openDeleteModal = (disciplina: Disciplina) => {
    setDeletingDisciplina(disciplina);
    setDeleteModal(true);
  };

  const closeModals = () => {
    setDisciplinaModal(false);
    setDeleteModal(false);
    setAreaModal(false);
    setEditingDisciplina(null);
    setDeletingDisciplina(null);
  };

  const handleViewDisciplina = (disciplina: Disciplina) => {
    // TODO: Implementar modal de visualização
    console.log("Ver disciplina:", disciplina);
  };

  const openAreaModal = () => {
    setAreaModal(true);
  };

  // Handlers de paginação
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 })); // Reset para página 1
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <DisciplinasHeader
        onCreateDisciplina={openCreateModal}
        onCreateArea={openAreaModal}
      />

      {/* Estatísticas */}
      <DisciplinasStats stats={stats} loading={statsLoading} />

      {/* Filtros e Tabela */}
      <Card>
        <CardContent>
          <div className="space-y-4">
            <DisciplinasFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              nivelFilter={nivelFilter}
              onNivelChange={setNivelFilter}
              areaFilter={areaFilter}
              onAreaChange={setAreaFilter}
              areas={areas}
            />

            <DisciplinasTable
              disciplinas={disciplinas}
              loading={loading}
              onView={handleViewDisciplina}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
            />

            {/* Paginação */}
            <DisciplinasPagination
              pagination={pagination}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <DisciplinaModal
        isOpen={disciplinaModal}
        onClose={closeModals}
        onSubmit={editingDisciplina ? handleUpdateDisciplina : handleCreateDisciplina}
        disciplina={editingDisciplina}
        areas={areas}
      />

      <DeleteDisciplinaModal
        isOpen={deleteModal}
        onClose={closeModals}
        onConfirm={handleDeleteDisciplina}
        disciplina={deletingDisciplina}
      />

      <AreaModal
        isOpen={areaModal}
        onClose={closeModals}
        onSubmit={handleCreateArea}
      />
    </div>
  );
}