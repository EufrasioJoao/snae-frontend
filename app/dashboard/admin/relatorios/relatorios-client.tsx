"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  MessageCircle, 
  GraduationCap,
  Download,
  RefreshCw,
  TrendingUp,
  Calendar
} from "lucide-react";

import RelatoriosHeader from "./_components/RelatoriosHeader";
import RelatorioGeral from "./_components/RelatorioGeral";

import { 
  RelatorioGeral as RelatorioGeralType,
  RelatorioUsuarios as RelatorioUsuariosType,
  RelatorioConteudos as RelatorioConteudosType,
  RelatorioDuvidas as RelatorioDuvidasType,
  RelatorioAvaliacoes as RelatorioAvaliacoesType,
  FiltrosRelatorio
} from "./_types/relatorio.types";
import api from "@/lib/api-requests";

export default function RelatoriosClient() {
  const [relatorioGeral, setRelatorioGeral] = useState<RelatorioGeralType | null>(null);
  const [relatorioUsuarios, setRelatorioUsuarios] = useState<RelatorioUsuariosType | null>(null);
  const [relatorioConteudos, setRelatorioConteudos] = useState<RelatorioConteudosType | null>(null);
  const [relatorioDuvidas, setRelatorioDuvidas] = useState<RelatorioDuvidasType | null>(null);
  const [relatorioAvaliacoes, setRelatorioAvaliacoes] = useState<RelatorioAvaliacoesType | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("geral");
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias atrás
    dataFim: new Date().toISOString().split('T')[0], // hoje
  });

  useEffect(() => {
    fetchRelatorios();
  }, [filtros]);

  const fetchRelatorios = async () => {
    try {
      setLoading(true);
      
      const [geral, usuarios, conteudos, duvidas, avaliacoes] = await Promise.all([
        api.relatorios.getGeral(filtros),
        api.relatorios.getUsuarios(filtros),
        api.relatorios.getConteudos(filtros),
        api.relatorios.getDuvidas(filtros),
        api.relatorios.getAvaliacoes(filtros),
      ]);

      if (geral.success) {
        setRelatorioGeral(geral.relatorio);
      }
      
      if (usuarios.success) {
        setRelatorioUsuarios(usuarios.relatorio);
      }
      
      if (conteudos.success) {
        setRelatorioConteudos(conteudos.relatorio);
      }
      
      if (duvidas.success) {
        setRelatorioDuvidas(duvidas.relatorio);
      }
      
      if (avaliacoes.success) {
        setRelatorioAvaliacoes(avaliacoes.relatorio);
      }
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
      toast.error("Erro ao carregar relatórios");
    } finally {
      setLoading(false);
    }
  };
 

  const handleFilterChange = (newFiltros: Partial<FiltrosRelatorio>) => {
    setFiltros(prev => ({ ...prev, ...newFiltros }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <RelatoriosHeader 
        onRefresh={fetchRelatorios}
        filtros={filtros}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {/* Relatórios */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="geral" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Usuários
          </TabsTrigger>
          <TabsTrigger value="conteudos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Conteúdos
          </TabsTrigger>
          <TabsTrigger value="duvidas" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Dúvidas
          </TabsTrigger>
          <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Avaliações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <RelatorioGeral 
            data={relatorioGeral}
            loading={loading}
            filtros={filtros}
          />
        </TabsContent>

        <TabsContent value="usuarios">
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Relatório de Usuários
            </h3>
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento. Aqui serão exibidos gráficos e estatísticas detalhadas sobre usuários.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="conteudos">
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Relatório de Conteúdos
            </h3>
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento. Aqui serão exibidos gráficos sobre criação, aprovação e uso de conteúdos.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="duvidas">
          <div className="text-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Relatório de Dúvidas
            </h3>
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento. Aqui serão exibidos dados sobre dúvidas criadas e respondidas.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="avaliacoes">
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Relatório de Avaliações
            </h3>
            <p className="text-gray-600">
              Funcionalidade em desenvolvimento. Aqui serão exibidos dados sobre quizzes e desempenho dos estudantes.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}