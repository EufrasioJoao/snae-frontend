"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageCircleQuestion, 
  Clock, 
  CheckCircle, 
  XCircle,
  Award,
  TrendingUp
} from "lucide-react";
import { DuvidaStats } from "../_types/professor-duvida.types";

interface DuvidasStatsProps {
  stats: DuvidaStats;
  loading?: boolean;
}

export default function DuvidasStats({ stats, loading = false }: DuvidasStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("pt-MZ").format(num);
  };

  const formatTempo = (horas: number) => {
    if (horas < 1) return `${Math.round(horas * 60)}min`;
    if (horas < 24) return `${Math.round(horas)}h`;
    return `${Math.round(horas / 24)}d`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Dúvidas Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatNumber(stats.duvidasPendentes)}
          </div>
          <p className="text-xs text-muted-foreground">
            De {formatNumber(stats.totalDuvidas)} total
          </p>
        </CardContent>
      </Card>

      {/* Dúvidas Respondidas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Respondidas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatNumber(stats.duvidasRespondidas)}
          </div>
          <p className="text-xs text-muted-foreground">
            {((stats.duvidasRespondidas / stats.totalDuvidas) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      {/* Tempo Médio de Resposta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTempo(stats.tempoMedioResposta)}</div>
          <p className="text-xs text-muted-foreground">
            Tempo médio de resposta
          </p>
        </CardContent>
      </Card>

      {/* Minhas Respostas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Minhas Respostas</CardTitle>
          <MessageCircleQuestion className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.minhasRespostas)}</div>
          <p className="text-xs text-muted-foreground">
            Respostas enviadas
          </p>
        </CardContent>
      </Card>

      {/* Melhores Respostas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Melhor Resposta</CardTitle>
          <Award className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatNumber(stats.melhorResposta)}
          </div>
          <p className="text-xs text-muted-foreground">
            Marcadas como melhor resposta
          </p>
        </CardContent>
      </Card>

      {/* Dúvidas por Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Por Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.porDisciplina.length > 0 ? (
            <div className="space-y-2">
              {stats.porDisciplina.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="truncate">{item.disciplina}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{item.quantidade}</span>
                    {item.pendentes > 0 && (
                      <span className="text-yellow-600">({item.pendentes})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              Nenhuma dúvida ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}