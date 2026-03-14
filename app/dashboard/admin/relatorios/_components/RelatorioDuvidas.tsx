"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { RelatorioDuvidas as RelatorioDuvidasType, FiltrosRelatorio } from "../_types/relatorio.types";

interface RelatorioDuvidasProps {
  data: RelatorioDuvidasType | null;
  loading: boolean;
  filtros: FiltrosRelatorio;
}

export default function RelatorioDuvidas({ data, loading, filtros }: RelatorioDuvidasProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Relatório de Dúvidas
      </h3>
      <p className="text-gray-600">
        Funcionalidade em desenvolvimento. Aqui serão exibidos dados sobre dúvidas criadas e respondidas.
      </p>
    </div>
  );
}