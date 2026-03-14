"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  CheckCircle, 
  Clock,
  BookOpen,
  Users,
  MessageSquare,
  Award
} from "lucide-react";
import { UserProfile } from "../_types/profile.types";

interface ProfileStatsProps {
  profile: UserProfile;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  const calculateDaysActive = () => {
    const createdDate = new Date(profile.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 4; // Nome, email, role, onboarding básico

    if (profile.name) completed++;
    if (profile.email && profile.emailVerified) completed++;
    if (profile.role) completed++;
    if (profile.finishedOnboarding) completed++;

    // Adicionar campos específicos do role
    if (profile.role === "ESTUDANTE" && profile.perfilEstudante) {
      total += 2; // nível e ano
      if (profile.perfilEstudante.nivelEnsino) completed++;
      if (profile.perfilEstudante.anoEscolar) completed++;
      
      if (profile.perfilEstudante.escola || profile.perfilEstudante.escolaManual) {
        total += 1;
        completed += 1;
      }
    }

    if (profile.role === "PROFESSOR" && profile.perfilProfessor) {
      total += 1; // especialidade
      if (profile.perfilProfessor.especialidade) completed++;
      
      if (profile.perfilProfessor.escola || profile.perfilProfessor.instituicao) {
        total += 1;
        completed += 1;
      }
    }

    return Math.round((completed / total) * 100);
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle,
    badge 
  }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    subtitle?: string;
    badge?: React.ReactNode;
  }) => (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          {badge}
        </div>
      </CardContent>
    </Card>
  );

  const completionPercentage = getCompletionPercentage();
  const daysActive = calculateDaysActive();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estatísticas do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Completude do Perfil */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Perfil Completo</span>
              <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {completionPercentage === 100 
                ? "Parabéns! Seu perfil está completo." 
                : "Complete seu perfil para uma melhor experiência."}
            </p>
          </div>

          {/* Status de Verificação */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className={`w-4 h-4 ${profile.emailVerified ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Email Verificado</span>
            </div>
            <Badge variant={profile.emailVerified ? "default" : "secondary"}>
              {profile.emailVerified ? "Sim" : "Não"}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <User className={`w-4 h-4 ${profile.finishedOnboarding ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">Onboarding</span>
            </div>
            <Badge variant={profile.finishedOnboarding ? "default" : "secondary"}>
              {profile.finishedOnboarding ? "Completo" : "Pendente"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas Gerais */}
      <StatCard
        icon={Calendar}
        title="Dias Ativo"
        value={daysActive}
        subtitle={daysActive === 1 ? "dia" : "dias"}
      />

      <StatCard
        icon={Clock}
        title="Última Atividade"
        value="Agora"
        subtitle="Online"
        badge={<div className="w-2 h-2 bg-green-500 rounded-full" />}
      />

      {/* Estatísticas Específicas por Role */}
      {profile.role === "ESTUDANTE" && (
        <>
          <StatCard
            icon={BookOpen}
            title="Disciplinas"
            value="12"
            subtitle="disponíveis"
          />
          
          <StatCard
            icon={Award}
            title="Progresso"
            value="0%"
            subtitle="concluído"
          />
        </>
      )}

      {profile.role === "PROFESSOR" && (
        <>
          <StatCard
            icon={Users}
            title="Estudantes"
            value="0"
            subtitle="atendidos"
          />
          
          <StatCard
            icon={MessageSquare}
            title="Dúvidas"
            value="0"
            subtitle="respondidas"
          />
        </>
      )}

      {profile.role === "ADMIN" && (
        <>
          <StatCard
            icon={Users}
            title="Usuários"
            value="1"
            subtitle="no sistema"
          />
          
          <StatCard
            icon={BookOpen}
            title="Disciplinas"
            value="32"
            subtitle="cadastradas"
          />
        </>
      )}
    </div>
  );
}