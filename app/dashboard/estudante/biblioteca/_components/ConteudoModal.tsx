"use client";

import { useState, useEffect } from "react";
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
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  Calendar, 
  User, 
  Building, 
  Hash,
  Eye,
  Tag,
  ExternalLink
} from "lucide-react";
import { ConteudoBiblioteca, ConteudoDetalhado } from "../_types/biblioteca.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import apiRequests from "@/lib/api-requests";
import { toast } from "sonner";

interface ConteudoModalProps {
  conteudo: ConteudoBiblioteca;
  open: boolean;
  onClose: () => void;
}

export default function ConteudoModal({
  conteudo,
  open,
  onClose
}: ConteudoModalProps) {
  const [conteudoDetalhado, setConteudoDetalhado] = useState<ConteudoDetalhado | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && conteudo) {
      fetchConteudoDetalhado();
    }
  }, [open, conteudo]);

  const fetchConteudoDetalhado = async () => {
    try {
      setLoading(true);
      const response = await apiRequests.estudante.getConteudoDetalhes(conteudo.id);
      setConteudoDetalhado(response);
    } catch (error) {
      console.error("Erro ao carregar detalhes do conteúdo:", error);
      toast.error("Erro ao carregar detalhes do conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (tipo: string) => {
    const icons = {
      LIVRO: BookOpen,
      MODULO: FileText,
      MATERIAL_COMPLEMENTAR: FileText,
      ARTIGO: FileText,
      VIDEO: Video,
      EXERCICIO: FileText
    };
    return icons[tipo as keyof typeof icons] || FileText;
  };

  const getTypeLabel = (tipo: string) => {
    const labels = {
      LIVRO: "Livro",
      MODULO: "Módulo",
      MATERIAL_COMPLEMENTAR: "Material Complementar",
      ARTIGO: "Artigo",
      VIDEO: "Vídeo",
      EXERCICIO: "Exercício"
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return null;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleDownload = () => {
    if (conteudoDetalhado?.urlDownload) {
      window.open(conteudoDetalhado.urlDownload, '_blank');
    } else {
      toast.error("Arquivo não disponível para download");
    }
  };

  const handleOpenInNewTab = () => {
    if (conteudoDetalhado?.urlDownload) {
      window.open(conteudoDetalhado.urlDownload, '_blank');
    } else {
      toast.error("Arquivo não disponível para visualização");
    }
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

  if (!conteudoDetalhado) {
    return null;
  }

  const TypeIcon = getTypeIcon(conteudoDetalhado.tipo);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100">
              <TypeIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="truncate">{conteudoDetalhado.titulo}</span>
                <Badge variant="outline">
                  {getTypeLabel(conteudoDetalhado.tipo)}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 font-normal">
                {conteudoDetalhado.disciplina.nome} • {conteudoDetalhado.autor}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[60vh]">
          <div className="space-y-6">
            {/* Informações Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{conteudoDetalhado.disciplina.nome}</p>
                  <p className="text-xs text-gray-500">
                    {conteudoDetalhado.disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Ensino Primário" : "Ensino Secundário"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{conteudoDetalhado.autor}</p>
                  {conteudoDetalhado.autorUser && (
                    <p className="text-xs text-gray-500">
                      {conteudoDetalhado.autorUser.role === 'PROFESSOR' ? 'Professor' : 'Autor'}
                    </p>
                  )}
                </div>
              </div>

              {conteudoDetalhado.editora && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Editora</p>
                    <p className="text-xs text-gray-500">{conteudoDetalhado.editora}</p>
                  </div>
                </div>
              )}

              {conteudoDetalhado.anoPublicacao && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Ano de Publicação</p>
                    <p className="text-xs text-gray-500">{conteudoDetalhado.anoPublicacao}</p>
                  </div>
                </div>
              )}

              {conteudoDetalhado.isbn && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">ISBN</p>
                    <p className="text-xs text-gray-500">{conteudoDetalhado.isbn}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Visualizações</p>
                  <p className="text-xs text-gray-500">{conteudoDetalhado.visualizacoes}</p>
                </div>
              </div>

              {conteudoDetalhado.topico && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tópico</p>
                    <p className="text-xs text-gray-500">{conteudoDetalhado.topico.nome}</p>
                  </div>
                </div>
              )}

              {conteudoDetalhado.tamanhoArquivo && (
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Tamanho do Arquivo</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(conteudoDetalhado.tamanhoArquivo)}
                      {conteudoDetalhado.formatoArquivo && ` (${conteudoDetalhado.formatoArquivo.toUpperCase()})`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Descrição */}
            {conteudoDetalhado.descricao && (
              <div>
                <h3 className="font-medium mb-2">Descrição</h3>
                <div className="p-4 bg-white border rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{conteudoDetalhado.descricao}</p>
                </div>
              </div>
            )}

            {/* Conteúdo de Texto */}
            {conteudoDetalhado.conteudoTexto && (
              <div>
                <h3 className="font-medium mb-2">Prévia do Conteúdo</h3>
                <div className="p-4 bg-white border rounded-lg max-h-64 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap text-sm">
                    {conteudoDetalhado.conteudoTexto.substring(0, 1000)}
                    {conteudoDetalhado.conteudoTexto.length > 1000 && "..."}
                  </p>
                </div>
              </div>
            )}

            {/* Informações de Data */}
            <div className="text-xs text-gray-500 p-4 bg-gray-50 rounded-lg">
              <p>
                Adicionado em {format(new Date(conteudoDetalhado.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              {conteudoDetalhado.updatedAt !== conteudoDetalhado.createdAt && (
                <p>
                  Atualizado em {format(new Date(conteudoDetalhado.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-500">
            Área: {conteudoDetalhado.disciplina.areaConhecimento}
          </div>
          
          <div className="flex gap-2">
            {conteudoDetalhado.urlDownload && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleOpenInNewTab} 
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em Nova Aba
                </Button>
                <Button onClick={handleDownload} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Baixar Arquivo
                </Button>
              </>
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