"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, RefreshCw } from "lucide-react";

// Components
import { ConteudoEducacional, ConteudoStats } from "../../admin/conteudos/_types/conteudo.types";
import ConteudosStats from "../../admin/conteudos/_components/ConteudosStats";
import ProfessorConteudosTable from "./_components/ProfessorConteudosTable";
import ProfessorConteudoModal from "./_components/ProfessorConteudoModal";
import DeleteConteudoModal from "./_components/DeleteConteudoModal";

import api from "@/lib/api-requests";

export default function ConteudosClient() {
  const router = useRouter();
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
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  // Modals
  const [selectedConteudo, setSelectedConteudo] = useState<ConteudoEducacional | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [conteudoToDelete, setConteudoToDelete] = useState<ConteudoEducacional | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchConteudos();
  }, [currentPage]);

  const fetchConteudos = async () => {
    try {
      setLoading(true);
      const response = await api.professor.getConteudos({
        page: currentPage,
        limit,
      });
      setConteudos(response.conteudos);
      setTotal(response.total);
      setTotalPages(response.totalPages);
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
      const response = await api.professor.getConteudosStats();
      setStats(response);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleView = async (conteudo: ConteudoEducacional) => {
    try {
      // Fetch full content details including presigned URL
      const response = await api.conteudo.getById(conteudo.id);
      setSelectedConteudo(response.conteudo);
      setViewModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes do conteúdo:", error);
      // Fallback to basic content data
      setSelectedConteudo(conteudo);
      setViewModalOpen(true);
      toast.error("Erro ao carregar arquivo para download");
    }
  };

  const handleEdit = (conteudo: ConteudoEducacional) => {
    router.push(`/dashboard/professor/conteudos/editar/${conteudo.id}`);
  };

  const handleDelete = (conteudo: ConteudoEducacional) => {
    setConteudoToDelete(conteudo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!conteudoToDelete) return;

    try {
      setDeleteLoading(true);
      await api.conteudo.delete(conteudoToDelete.id);
      toast.success("Conteúdo excluído com sucesso");
      setDeleteModalOpen(false);
      setConteudoToDelete(null);
      fetchConteudos();
      fetchStats();
    } catch (error) {
      console.error("Erro ao excluir conteúdo:", error);
      toast.error("Erro ao excluir conteúdo");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchConteudos();
    fetchStats();
  };

  const handleCreateNew = () => {
    router.push("/dashboard/professor/conteudos/criar");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Conteúdos</h1>
          <p className="text-gray-600">Gerencie seus conteúdos educacionais</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Conteúdo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <ConteudosStats stats={stats} loading={statsLoading} />

      {/* Content */}
      <Tabs defaultValue="todos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="todos">Todos ({stats.total})</TabsTrigger>
          <TabsTrigger value="pendentes">Pendentes ({stats.pendentes})</TabsTrigger>
          <TabsTrigger value="aprovados">Aprovados ({stats.aprovados})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardContent className="pt-6">
              <ProfessorConteudosTable
                conteudos={conteudos}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                total={total}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pendentes">
          <Card>
            <CardContent className="pt-6">
              <ProfessorConteudosTable
                conteudos={conteudos.filter(c => !c.publicado)}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                total={conteudos.filter(c => !c.publicado).length}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprovados">
          <Card>
            <CardContent className="pt-6">
              <ProfessorConteudosTable
                conteudos={conteudos.filter(c => c.publicado)}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
                total={conteudos.filter(c => c.publicado).length}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ProfessorConteudoModal
        conteudo={selectedConteudo}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedConteudo(null);
        }}
        onEdit={handleEdit}
      />

      <DeleteConteudoModal
        conteudo={conteudoToDelete}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setConteudoToDelete(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}