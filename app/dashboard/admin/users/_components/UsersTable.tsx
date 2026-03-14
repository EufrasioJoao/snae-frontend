"use client";

import { Users, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "../_types/user.types";
import { formatNivelEnsino, formatDate } from "../_utils/formatters";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onView: (user: User) => void;
}

export default function UsersTable({ 
  users, 
  loading, 
  onRefresh,
  onEdit, 
  onDelete, 
  onView 
}: UsersTableProps) {
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { label: "Admin", variant: "destructive" as const },
      PROFESSOR: { label: "Professor", variant: "default" as const },
      ESTUDANTE: { label: "Estudante", variant: "secondary" as const },
      USER: { label: "Utilizador", variant: "outline" as const },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (user: User) => {
    if (!user.emailVerified) {
      return <Badge variant="outline">Email não verificado</Badge>;
    }
    if (!user.finishedOnboarding) {
      return <Badge variant="secondary">Onboarding pendente</Badge>;
    }
    return <Badge variant="default">Ativo</Badge>;
  };

  const getProfileInfo = (user: User) => {
    if (user.perfilEstudante) {
      return (
        <div className="text-sm">
          <div>{formatNivelEnsino(user.perfilEstudante.nivelEnsino)}</div>
          <div className="text-gray-500">{user.perfilEstudante.anoEscolar}ª classe</div>
          {user.perfilEstudante.escola && (
            <div className="text-gray-500 text-xs">{user.perfilEstudante.escola.nome}</div>
          )}
          {user.perfilEstudante.escolaManual && (
            <div className="text-gray-500 text-xs">{user.perfilEstudante.escolaManual}</div>
          )}
        </div>
      );
    }
    
    if (user.perfilProfessor) {
      return (
        <div className="text-sm">
          <div>{user.perfilProfessor.especialidade}</div>
          {user.perfilProfessor.escola && (
            <div className="text-gray-500 text-xs">{user.perfilProfessor.escola.nome}</div>
          )}
          {user.perfilProfessor.instituicao && (
            <div className="text-gray-500 text-xs">{user.perfilProfessor.instituicao}</div>
          )}
        </div>
      );
    }

    return <div className="text-sm text-gray-500">-</div>;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Informações</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum utilizador encontrado</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{getProfileInfo(user)}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onView(user)}
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit(user)}
                          title="Editar utilizador"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDelete(user)}
                          title="Excluir utilizador"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}