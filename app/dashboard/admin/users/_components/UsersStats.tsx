"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "../_types/user.types";

interface UsersStatsProps {
  stats: UserStats;
}

export default function UsersStats({ stats }: UsersStatsProps) {
  const statsConfig = [
    {
      title: "Total de Utilizadores",
      value: stats.total,
      color: "text-gray-900",
    },
    {
      title: "Estudantes",
      value: stats.estudantes,
      color: "text-blue-600",
    },
    {
      title: "Professores",
      value: stats.professores,
      color: "text-green-600",
    },
    {
      title: "Administradores",
      value: stats.admins,
      color: "text-red-600",
    },
    {
      title: "Onboarding Pendente",
      value: stats.pendingOnboarding,
      color: "text-orange-600",
    },
  ];

  const additionalStats = [
    {
      title: "Utilizadores Ativos",
      value: stats.activeUsers,
      color: "text-emerald-600",
    },
    {
      title: "Emails Verificados",
      value: stats.verifiedUsers,
      color: "text-purple-600",
    },
    {
      title: "Emails Não Verificados",
      value: stats.unverifiedEmails,
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsConfig.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {additionalStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}