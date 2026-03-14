"use client";

import { X, User, Mail, Calendar, Shield, GraduationCap, School, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserType } from "../_types/user.types";
import { formatNivelEnsino, formatRole, formatDate } from "../_utils/formatters";

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

export default function ViewUserModal({ isOpen, onClose, user }: ViewUserModalProps) {
  if (!user) return null;

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Administrador", variant: "destructive" as const },
      PROFESSOR: { label: "Professor", variant: "default" as const },
      ESTUDANTE: { label: "Estudante", variant: "secondary" as const },
      USER: { label: "Utilizador", variant: "outline" as const },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (user: UserType) => {
    if (!user.emailVerified) {
      return <Badge variant="outline">Email não verificado</Badge>;
    }
    if (!user.finishedOnboarding) {
      return <Badge variant="secondary">Onboarding pendente</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-gray-500 font-normal">{user.email}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome Completo</label>
                  <p className="text-sm text-gray-900 mt-1">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Tipo de Conta</label>
                  <div className="mt-1">
                    {getRoleBadge(user.role)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(user)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Criado em</label>
                  <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Onboarding</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {user.finishedOnboarding ? "✅ Concluído" : "⏳ Pendente"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Perfil de Estudante */}
          {user.perfilEstudante && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Perfil de Estudante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nível de Ensino</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatNivelEnsino(user.perfilEstudante.nivelEnsino)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ano Escolar</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {user.perfilEstudante.anoEscolar}ª classe
                    </p>
                  </div>
                  {user.perfilEstudante.escola && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Escola</label>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <School className="w-3 h-3" />
                        {user.perfilEstudante.escola.nome}
                      </p>
                    </div>
                  )}
                  {user.perfilEstudante.escolaManual && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Escola (Manual)</label>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <School className="w-3 h-3" />
                        {user.perfilEstudante.escolaManual}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Perfil de Professor */}
          {user.perfilProfessor && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Perfil de Professor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Especialidade</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {user.perfilProfessor.especialidade}
                    </p>
                  </div>
                  {user.perfilProfessor.escola && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Escola</label>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <School className="w-3 h-3" />
                        {user.perfilProfessor.escola.nome}
                      </p>
                    </div>
                  )}
                  {user.perfilProfessor.instituicao && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Instituição</label>
                      <p className="text-sm text-gray-900 mt-1 flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {user.perfilProfessor.instituicao}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações de Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">ID do Utilizador:</span>
                  <p className="text-gray-900 font-mono text-xs mt-1">{user.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email Verificado:</span>
                  <p className="text-gray-900 mt-1">
                    {user.emailVerified ? "✅ Sim" : "❌ Não"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}