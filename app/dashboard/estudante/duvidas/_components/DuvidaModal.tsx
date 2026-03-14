"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  User, 
  GraduationCap,
  Calendar,
  BookOpen,
  Tag
} from "lucide-react";
import { EstudanteDuvida, DuvidaDetalhada } from "../_types/estudante-duvida.types";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import apiRequests from "@/lib/api-requests";
import { toast } from "sonner";

interface DuvidaModalProps {
  duvida: EstudanteDuvida;
  open: boolean;
  onClose: () => void;
}

export default function DuvidaModal({
  duvida,
  open,
  onClose
}: DuvidaModalProps) {
  const [duvidaDetalhada, setDuvidaDetalhada] = useState<DuvidaDetalhada | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && duvida) {
      fetchDuvidaDetalhada();
    }
  }, [open, duvida]);

  const fetchDuvidaDetalhada = async () => {
    try {
      setLoading(true);
      const response = await apiRequests.estudante.getDuvidaById(duvida.id);
      setDuvidaDetalhada(response);
    } catch (error) {
      console.error("Erro ao carregar detalhes da dúvida:", error);
      toast.error("Erro ao carregar detalhes da dúvida");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDENTE: { label: "Pendente", variant: "secondary" as const, icon: Clock, color: "text-yellow-600" },
      EM_ANALISE: { label: "Em Análise", variant: "default" as const, icon: MessageCircle, color: "text-blue-600" },
      RESPONDIDA: { label: "Respondida", variant: "default" as const, icon: CheckCircle, color: "text-green-600" },
      FECHADA: { label: "Fechada", variant: "outline" as const, icon: XCircle, color: "text-gray-600" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRoleIcon = (role: string) => {
    return role === 'PROFESSOR' ? GraduationCap : User;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'PROFESSOR') {
      return <Badge variant="default" className="text-xs">Professor</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Estudante</Badge>;
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!duvidaDetalhada) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="truncate">{duvidaDetalhada.titulo}</span>
            {getStatusBadge(duvidaDetalhada.status)}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-6">
            {/* Informações da Dúvida */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{duvidaDetalhada.disciplina.nome}</p>
                    <p className="text-xs text-gray-500">
                      {duvidaDetalhada.disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Ensino Primário" : "Ensino Secundário"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(duvidaDetalhada.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(duvidaDetalhada.createdAt), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                </div>

                {duvidaDetalhada.topico && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Tópico</p>
                      <p className="text-xs text-gray-500">{duvidaDetalhada.topico.nome}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{duvidaDetalhada.respostas.length} respostas</p>
                    <p className="text-xs text-gray-500">
                      {duvidaDetalhada.respostas.filter(r => r.autor.role === 'PROFESSOR').length} de professores
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição da Dúvida */}
              <div>
                <h3 className="font-medium mb-2">Descrição</h3>
                <div className="p-4 bg-white border rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{duvidaDetalhada.descricao}</p>
                </div>
              </div>
            </div>

            {/* Respostas */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Respostas ({duvidaDetalhada.respostas.length})
              </h3>

              {duvidaDetalhada.respostas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Ainda não há respostas para esta dúvida.</p>
                  <p className="text-sm">Aguarde que um professor responda em breve.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {duvidaDetalhada.respostas.map((resposta, index) => {
                    const RoleIcon = getRoleIcon(resposta.autor.role);
                    return (
                      <div key={resposta.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                              <RoleIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{resposta.autor.name}</span>
                                {getRoleBadge(resposta.autor.role)}
                                {resposta.melhorResposta && (
                                  <Badge variant="default" className="text-xs bg-green-600">
                                    Melhor Resposta
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {format(new Date(resposta.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="pl-11">
                          <p className="text-gray-700 whitespace-pre-wrap">{resposta.conteudo}</p>
                          
                          {resposta.likes > 0 && (
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <CheckCircle className="h-4 w-4" />
                              {resposta.likes} curtidas
                            </div>
                          )}
                        </div>

                        {index < duvidaDetalhada.respostas.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}