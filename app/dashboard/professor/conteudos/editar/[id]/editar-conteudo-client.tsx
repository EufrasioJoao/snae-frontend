"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileText, Video, Eye, BookOpen, Save, Download } from "lucide-react";
import api from "@/lib/api";
import apiRequests from "@/lib/api-requests";
import { DisciplinaSelect } from "@/components/ui/disciplina-select";

interface Disciplina {
  id: string;
  nome: string;
  descricao?: string;
  nivelEnsino: string;
  areaConhecimento: {
    id: string;
    nome: string;
  };
}

interface Topico {
  id: string;
  nome: string;
  disciplinaId: string;
}

interface ConteudoData {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  disciplinaId: string;
  topicoId?: string;
  conteudoTexto?: string;
  urlArquivo?: string;
  autor?: string;
  editora?: string;
  anoPublicacao?: number;
  isbn?: string;
  publicado: boolean;
  disciplina: {
    id: string;
    nome: string;
    nivelEnsino: string;
  };
}

export default function EditarConteudoClient() {
  const router = useRouter();
  const params = useParams();
  const conteudoId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [loadingContent, setLoadingContent] = useState(true);
  const [disciplinasLoading, setDisciplinasLoading] = useState(true);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    disciplinaId: "",
    topicoId: "",
    conteudoTexto: "",
    autor: "",
    editora: "",
    anoPublicacao: "",
    isbn: "",
  });

  // Separate state for current file info (read-only)
  const [currentFile, setCurrentFile] = useState<{
    url?: string;
    presignedUrl?: string;
    name?: string;
  }>({});

  const tiposConteudo = [
    { value: "LIVRO", label: "Livro", icon: FileText },
    { value: "MODULO", label: "Módulo", icon: FileText },
    { value: "MATERIAL_COMPLEMENTAR", label: "Material Complementar", icon: FileText },
    { value: "ARTIGO", label: "Artigo", icon: FileText },
    { value: "VIDEO", label: "Vídeo", icon: Video },
    { value: "EXERCICIO", label: "Exercício", icon: FileText },
  ];

  useEffect(() => {
    fetchConteudo();
    fetchDisciplinas();
  }, [conteudoId]);

  useEffect(() => {
    if (formData.disciplinaId) {
      fetchTopicos(formData.disciplinaId);
    } else {
      setTopicos([]);
    }
  }, [formData.disciplinaId]);

  const fetchConteudo = async () => {
    try {
      setLoadingContent(true);
      const response = await apiRequests.conteudo.getById(conteudoId);
      const conteudo: ConteudoData = response.conteudo;
      
      setFormData({
        titulo: conteudo.titulo,
        descricao: conteudo.descricao || "",
        tipo: conteudo.tipo,
        disciplinaId: conteudo.disciplinaId,
        topicoId: conteudo.topicoId || "",
        conteudoTexto: conteudo.conteudoTexto || "",
        autor: conteudo.autor || "",
        editora: conteudo.editora || "",
        anoPublicacao: conteudo.anoPublicacao?.toString() || "",
        isbn: conteudo.isbn || "",
      });

      // Set current file info (read-only)
      setCurrentFile({
        url: conteudo.urlArquivo,
        presignedUrl: response.conteudo.presignedUrl,
        name: conteudo.urlArquivo ? conteudo.urlArquivo.split('/').pop() : undefined,
      });
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      toast.error("Erro ao carregar conteúdo");
      router.push("/dashboard/professor/conteudos");
    } finally {
      setLoadingContent(false);
    }
  };

  const fetchDisciplinas = async () => {
    try {
      setDisciplinasLoading(true);
      const response = await apiRequests.professor.getDisciplinas();
      
      if (response.disciplinas && response.disciplinas.length > 0) {
        setDisciplinas(response.disciplinas);
      } else {
        const allDisciplinasResponse = await apiRequests.disciplina.getAll();
        setDisciplinas(allDisciplinasResponse.disciplinas || []);
      }
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      try {
        const fallbackResponse = await apiRequests.disciplina.getAll();
        setDisciplinas(fallbackResponse.disciplinas || []);
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError);
        toast.error("Erro ao carregar disciplinas");
      }
    } finally {
      setDisciplinasLoading(false);
    }
  };

  const fetchTopicos = async (disciplinaId: string) => {
    try {
      // TODO: Implementar API para buscar tópicos por disciplina
      setTopicos([]);
    } catch (error) {
      console.error("Erro ao carregar tópicos:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Remove file upload functions since editing doesn't allow file changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.tipo || !formData.disciplinaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);

      // Update only editable fields (no file or link changes)
      const updateData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        disciplinaId: formData.disciplinaId,
        topicoId: formData.topicoId || undefined,
        conteudo: formData.conteudoTexto,
        autor: formData.autor,
        editora: formData.editora,
        anoPublicacao: formData.anoPublicacao ? parseInt(formData.anoPublicacao) : undefined,
        isbn: formData.isbn,
      };

      await apiRequests.conteudo.update(conteudoId, updateData);
      
      toast.success("Conteúdo atualizado com sucesso!");
      router.push("/dashboard/professor/conteudos");
      
    } catch (error) {
      console.error("Erro ao atualizar conteúdo:", error);
      toast.error("Erro ao atualizar conteúdo");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    toast.info("Funcionalidade de preview em desenvolvimento");
  };

  if (loadingContent) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Conteúdo</h1>
          <p className="text-gray-600">
            Atualize as informações do seu material educacional
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                    placeholder="Digite o título do conteúdo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    placeholder="Descreva o conteúdo (opcional)"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Conteúdo *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => handleInputChange("tipo", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposConteudo.map((tipo) => {
                          const Icon = tipo.icon;
                          return (
                            <SelectItem key={tipo.value} value={tipo.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {tipo.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="disciplina">Disciplina *</Label>
                    <DisciplinaSelect
                      disciplinas={disciplinas}
                      value={formData.disciplinaId}
                      onValueChange={(value) => handleInputChange("disciplinaId", value)}
                      disabled={disciplinasLoading}
                      loading={disciplinasLoading}
                    />
                  </div>
                </div>

                {topicos.length > 0 && (
                  <div>
                    <Label htmlFor="topico">Tópico (Opcional)</Label>
                    <Select
                      value={formData.topicoId}
                      onValueChange={(value) => handleInputChange("topicoId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tópico" />
                      </SelectTrigger>
                      <SelectContent>
                        {topicos.map((topico) => (
                          <SelectItem key={topico.id} value={topico.id}>
                            {topico.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conteúdo */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="conteudoTexto">Texto do Conteúdo</Label>
                  <Textarea
                    id="conteudoTexto"
                    value={formData.conteudoTexto}
                    onChange={(e) => handleInputChange("conteudoTexto", e.target.value)}
                    placeholder="Digite o conteúdo textual (opcional)"
                    rows={8}
                  />
                </div>

                {/* Current File Display (Read-only) */}
                {currentFile.url && (
                  <div>
                    <Label>Arquivo Atual</Label>
                    <div className="p-4 bg-gray-50 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium">
                            {currentFile.name || "Arquivo anexado"}
                          </span>
                        </div>
                        {currentFile.presignedUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={currentFile.presignedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Baixar
                            </a>
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Arquivos não podem ser alterados durante a edição
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadados */}
            <Card>
              <CardHeader>
                <CardTitle>Metadados (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="autor">Autor</Label>
                    <Input
                      id="autor"
                      value={formData.autor}
                      onChange={(e) => handleInputChange("autor", e.target.value)}
                      placeholder="Nome do autor"
                    />
                  </div>

                  <div>
                    <Label htmlFor="editora">Editora</Label>
                    <Input
                      id="editora"
                      value={formData.editora}
                      onChange={(e) => handleInputChange("editora", e.target.value)}
                      placeholder="Nome da editora"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="anoPublicacao">Ano de Publicação</Label>
                    <Input
                      id="anoPublicacao"
                      type="number"
                      value={formData.anoPublicacao}
                      onChange={(e) => handleInputChange("anoPublicacao", e.target.value)}
                      placeholder="2024"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>

                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange("isbn", e.target.value)}
                      placeholder="978-0-123456-78-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="w-full flex items-center gap-2"
                  disabled={!formData.titulo}
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>

                <Button
                  type="submit"
                  className="w-full flex items-center gap-2"
                  disabled={loading}
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>

                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Apenas informações básicas e metadados podem ser editados. 
                    Arquivos e links não podem ser alterados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}