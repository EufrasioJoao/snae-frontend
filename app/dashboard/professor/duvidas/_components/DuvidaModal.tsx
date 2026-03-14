"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Tag
} from "lucide-react";
import { Duvida } from "../_types/professor-duvida.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";

interface DuvidaModalProps {
  duvida: Duvida | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DuvidaModal({
  duvida,
  open,
  onClose,
  onSuccess
}: DuvidaModalProps) {
  const [resposta, setResposta] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  const handleEnviarResposta = async () => {
    if (!duvida || !resposta.trim()) {
      toast.error("Digite uma resposta antes de enviar");
      return;
    }

    try {
      setEnviandoResposta(true);
      await apiRequests.professor.responderDuvida(duvida.id, { 
        conteudo: resposta.trim() 
      });
      
      toast.success("Resposta enviada com sucesso!");
      setResposta("");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao enviar resposta:", error);
      toast.error(error.response?.data?.error || "Erro ao enviar resposta");
    } finally {
      setEnviandoResposta(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "EM_ANALISE":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "RESPONDIDA":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "FECHADA":
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "Pendente";
      case "EM_ANALISE":
        return "Em Análise";
      case "RESPONDIDA":
        return "Respondida";
      case "FECHADA":
        return "Fechada";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE":
        return "bg-yellow-100 text-yellow-800";
      case "EM_ANALISE":
        return "bg-blue-100 text-blue-800";
      case "RESPONDIDA":
        return "bg-green-100 text-green-800";
      case "FECHADA":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  if (!duvida) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(duvida.status)}
              <span className="truncate">{duvida.titulo}</span>
            </div>
            <Badge className={getStatusColor(duvida.status)}>
              {getStatusLabel(duvida.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-6">
            {/* Informações da Dúvida */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{duvida.estudante.name}</p>
                  <p className="text-xs text-gray-500">
                    {duvida.estudante.anoEscolar ? `${duvida.estudante.anoEscolar}ª classe` : 'Estudante'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{duvida.disciplina.nome}</p>
                  <p className="text-xs text-gray-500">Disciplina</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(duvida.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="text-xs text-gray-500">Data da dúvida</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{duvida.respostas.length} respostas</p>
                  <p className="text-xs text-gray-500">
                    {duvida.respostas.filter(r => r.autor.role === 'PROFESSOR').length} de professores
                  </p>
                </div>
              </div>
            </div>

            {/* Descrição da Dúvida */}
            <div>
              <h3 className="font-medium mb-2">Descrição da Dúvida</h3>
              <div className="p-4 bg-white border rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{duvida.descricao}</p>
              </div>
            </div>

            {/* Tags (se existirem) */}
            {duvida.tags && duvida.tags.length > 0 && (
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {duvida.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Respostas Existentes */}
            <div>
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Respostas ({duvida.respostas.length})
              </h3>

              {duvida.respostas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Ainda não há respostas para esta dúvida.</p>
                  <p className="text-sm">Seja o primeiro a responder!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {duvida.respostas.map((resposta, index) => {
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

                        {index < duvida.respostas.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Formulário de Resposta */}
            {duvida.status === "PENDENTE" && (
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Sua Resposta</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resposta">Conteúdo da Resposta</Label>
                    <Textarea
                      id="resposta"
                      placeholder="Digite sua resposta detalhada para ajudar o estudante..."
                      value={resposta}
                      onChange={(e) => setResposta(e.target.value)}
                      rows={6}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Seja claro e detalhado em sua explicação. Inclua exemplos se necessário.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            Última atualização: {format(new Date(duvida.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
          
          <div className="flex gap-2">
            {duvida.status === "PENDENTE" && (
              <Button 
                onClick={handleEnviarResposta}
                disabled={!resposta.trim() || enviandoResposta}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {enviandoResposta ? "Enviando..." : "Enviar Resposta"}
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}