"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { EstudanteDuvidasStats as StatsType } from "../_types/estudante-duvida.types";

interface EstudanteDuvidasStatsProps {
  stats: StatsType;
}

export default function EstudanteDuvidasStats({ stats }: EstudanteDuvidasStatsProps) {
  const statCards = [
    {
      title: "Total de Dúvidas",
      value: stats.total,
      icon: HelpCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Pendentes",
      value: stats.pendentes,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Respondidas",
      value: stats.respondidas,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Fechadas",
      value: stats.fechadas,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stats.total > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {((stat.value / stats.total) * 100).toFixed(1)}% do total
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}