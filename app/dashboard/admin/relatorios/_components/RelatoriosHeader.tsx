"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  RefreshCw, 
  Download, 
  FileText, 
  Calendar,
  Filter
} from "lucide-react";
import { FiltrosRelatorio } from "../_types/relatorio.types";

interface RelatoriosHeaderProps {
  onRefresh: () => void;
  filtros: FiltrosRelatorio;
  onFilterChange: (filtros: Partial<FiltrosRelatorio>) => void;
  loading: boolean;
}

export default function RelatoriosHeader({
  onRefresh,
  filtros,
  onFilterChange,
  loading,
}: RelatoriosHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Título e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">
            Analytics e estatísticas do sistema SNAE
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filtros</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Data Início */}
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dataInicio"
                  type="date"
                  value={filtros.dataInicio || ""}
                  onChange={(e) => onFilterChange({ dataInicio: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Data Fim */}
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dataFim"
                  type="date"
                  value={filtros.dataFim || ""}
                  onChange={(e) => onFilterChange({ dataFim: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Nível de Ensino */}
            <div className="space-y-2">
              <Label>Nível de Ensino</Label>
              <Select
                value={filtros.nivelEnsino || "all"}
                onValueChange={(value) => onFilterChange({ 
                  nivelEnsino: value === "all" ? undefined : value as any 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="ENSINO_PRIMARIO">Ensino Primário</SelectItem>
                  <SelectItem value="ENSINO_SECUNDARIO">Ensino Secundário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Usuário */}
            <div className="space-y-2">
              <Label>Tipo de Usuário</Label>
              <Select
                value={filtros.tipoUsuario || "all"}
                onValueChange={(value) => onFilterChange({ 
                  tipoUsuario: value === "all" ? undefined : value as any 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="ESTUDANTE">Estudantes</SelectItem>
                  <SelectItem value="PROFESSOR">Professores</SelectItem>
                  <SelectItem value="ADMIN">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}