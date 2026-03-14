"use client";

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
  Download, 
  Calendar,
  User,
  BookOpen,
  FileText,
  Video,
  FileIcon,
  Eye,
  ExternalLink,
  Edit
} from "lucide-react";
import { ConteudoEducacional } from "../../../admin/conteudos/_types/conteudo.types";

interface ProfessorConteudoModalProps {
  conteudo: ConteudoEducacional | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (conteudo: ConteudoEducacional) => void;
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

export default function ProfessorConteudoModal({
  conteudo,
  isOpen,
  onClose,
  onEdit,
}: ProfessorConteudoModalProps) {
  if (!conteudo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
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
              <div>
                <span className="text-sm font-medium text-gray-500">Status</span>
                <div className="mt-1">
                  <Badge variant={conteudo.publicado ? "default" : "secondary"}>
                    {conteudo.publicado ? "Aprovado" : "Pendente Aprovação"}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Tipo</span>
                <div className="mt-1">
                  <Badge variant="outline">
                    {tipoLabels[conteudo.tipo as keyof typeof tipoLabels]}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Disciplina</span>
                <div className="mt-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{conteudo.disciplina.nome}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {conteudo.disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Ensino Primário" : "Ensino Secundário"} • {conteudo.disciplina.areaConhecimento.nome}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Estatísticas</span>
                
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>{conteudo.visualizacoes} visualizações</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Autor</span>
                <div className="mt-1 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{conteudo.autor}</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Data de Criação</span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-900">{formatDate(conteudo.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Descrição */}
          {conteudo.descricao && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
              <p className="text-gray-700 leading-relaxed">{conteudo.descricao}</p>
            </div>
          )}

          {/* Conteúdo de Texto */}
          {(conteudo.tipo === "ARTIGO" || conteudo.tipo === "MODULO") && conteudo.conteudoTexto && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Conteúdo</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: conteudo.conteudoTexto }} />
                </div>
              </div>
            </div>
          )}

          {/* Arquivo Anexado */}
          {conteudo.urlArquivo && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Arquivo</h3>
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
            </div>
          )}

          {/* Informações Adicionais */}
          {(conteudo.editora || conteudo.anoPublicacao || conteudo.isbn) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {conteudo.editora && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Editora</span>
                    <p className="text-sm text-gray-900 mt-1">{conteudo.editora}</p>
                  </div>
                )}
                {conteudo.anoPublicacao && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ano de Publicação</span>
                    <p className="text-sm text-gray-900 mt-1">{conteudo.anoPublicacao}</p>
                  </div>
                )}
                {conteudo.isbn && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">ISBN</span>
                    <p className="text-sm text-gray-900 mt-1">{conteudo.isbn}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={() => onEdit(conteudo)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Conteúdo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}