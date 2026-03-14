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
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Download, 
  Calendar,
  User,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Image as ImageIcon,
  FileIcon,
  Link,
  Eye,
  ExternalLink
} from "lucide-react";
import { ConteudoEducacional } from "../_types/conteudo.types";

interface ConteudoModalProps {
  conteudo: ConteudoEducacional | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (conteudoId: string) => void;
  onReject: (conteudoId: string) => void;
}

const tipoIcons = {
  LIVRO: BookOpen,
  MODULO: FileText,
  MATERIAL_COMPLEMENTAR: FileIcon,
  ARTIGO: FileText,
  VIDEO: Video,
  EXERCICIO: FileText,
};

const tipoLabels = {
  LIVRO: "Livro",
  MODULO: "Módulo",
  MATERIAL_COMPLEMENTAR: "Material Complementar",
  ARTIGO: "Artigo",
  VIDEO: "Vídeo",
  EXERCICIO: "Exercício",
};
export default function ConteudoModal({
  conteudo,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ConteudoModalProps) {
  const [actionLoading, setActionLoading] = useState(false);

  if (!conteudo) return null;

  const TipoIcon = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileText;

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setActionLoading(true);
      await action();
      onClose();
    } finally {
      setActionLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-MZ", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {(() => {
              const IconComponent = tipoIcons[conteudo.tipo as keyof typeof tipoIcons] || FileIcon;
              return <IconComponent className="w-6 h-6 text-gray-600" />;
            })()}
            {conteudo.titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Metadados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={conteudo.publicado ? "default" : "secondary"}
                  className={conteudo.publicado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {conteudo.publicado ? "Aprovado" : "Pendente"}
                </Badge>
                <Badge variant="outline">
                  {tipoLabels[conteudo.tipo]}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Disciplina:</span>
                  <span>{conteudo.disciplina.nome}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Autor:</span>
                  <span>{conteudo.autor || "Autor desconhecido"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Criado em:</span>
                  <span>{formatDate(conteudo.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>{conteudo.visualizacoes} visualizações</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-500" />
                  <span>{conteudo.visualizacoes} downloads</span>
                </div>
              </div>

              {conteudo.topico && (
                <div className="text-sm">
                  <span className="font-medium">Tópico:</span>
                  <Badge variant="outline" className="ml-2">
                    {conteudo.topico.nome}
                  </Badge>
                </div>
              )}

              {conteudo.publicado && (
                <div className="text-sm">
                  <span className="font-medium">Status:</span>
                  <div className="mt-1">
                    Conteúdo aprovado
                    <div className="text-gray-500">
                      {formatDate(conteudo.updatedAt)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          {conteudo.descricao && (
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {conteudo.descricao}
              </p>
            </div>
          )}

          {/* Conteúdo */}
          <div>
            <h3 className="font-semibold mb-3">Conteúdo</h3>
            
            {(conteudo.tipo === "ARTIGO" || conteudo.tipo === "MODULO") && conteudo.conteudoTexto && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: conteudo.conteudoTexto }} />
                </div>
              </div>
            )}

            {conteudo.urlArquivo && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-sm text-gray-600">
                      Arquivo anexado
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {conteudo.urlArquivo.split('/').pop()}
                    </p>
                  </div>
                  {conteudo.presignedUrl ? (
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={conteudo.presignedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      <Download className="w-4 h-4 mr-2" />
                      Indisponível
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tags - removido por enquanto pois não existe no schema atual */}

          {/* Ações */}
          {!conteudo.publicado && (
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => handleAction(async () => onApprove(conteudo.id))}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar Conteúdo
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAction(async () => onReject(conteudo.id))}
                disabled={actionLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}