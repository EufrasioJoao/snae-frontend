"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Mail, Shield, User, GraduationCap } from "lucide-react";
import { UserProfile } from "../_types/profile.types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Administrador", variant: "destructive" as const, icon: Shield },
      PROFESSOR: { label: "Professor", variant: "default" as const, icon: GraduationCap },
      ESTUDANTE: { label: "Estudante", variant: "secondary" as const, icon: User },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.ESTUDANTE;
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <Avatar className="w-20 h-20">
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Informações Principais */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{profile.email}</span>
                {profile.emailVerified && (
                  <Badge variant="outline" className="text-xs">
                    Verificado
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {getRoleBadge(profile.role)}
              
              {profile.perfilEstudante && (
                <Badge variant="outline">
                  {profile.perfilEstudante.nivelEnsino === "ENSINO_PRIMARIO" 
                    ? "Ensino Primário" 
                    : "Ensino Secundário"} - {profile.perfilEstudante.anoEscolar}ª classe
                </Badge>
              )}
              
              {profile.perfilProfessor && (
                <Badge variant="outline">
                  {profile.perfilProfessor.especialidade}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Membro desde {formatDate(profile.createdAt)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-end gap-2">
            {profile.finishedOnboarding ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                Perfil Completo
              </Badge>
            ) : (
              <Badge variant="secondary">
                Perfil Incompleto
              </Badge>
            )}
            
            <span className="text-xs text-gray-500">
              Atualizado em {formatDate(profile.updatedAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}