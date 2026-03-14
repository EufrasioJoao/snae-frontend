"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, FileText, Video, Eye, BookOpen, Save } from "lucide-react";
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

export default function CriarConteudoClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const disciplinaParam = searchParams.get("disciplina");

  const [loading, setLoading] = useState(false);
  const [disciplinasLoading, setDisciplinasLoading] = useState(true);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    tipo: "",
    disciplinaId: disciplinaParam || "",
    topicoId: "",
    conteudoTexto: "",
    linkExterno: "",
    arquivo: null as File | null,
  });

  const tiposConteudo = [
    { value: "LIVRO", label: "Livro", icon: FileText },
    { value: "MODULO", label: "Módulo", icon: FileText },
    { value: "MATERIAL_COMPLEMENTAR", label: "Material Complementar", icon: FileText },
    { value: "ARTIGO", label: "Artigo", icon: FileText },
    { value: "VIDEO", label: "Vídeo", icon: Video },
    { value: "EXERCICIO", label: "Exercício", icon: FileText },
  ];

  useEffect(() => {
    console.log("Componente montado, iniciando fetch de disciplinas...");
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    console.log("Estado das disciplinas atualizado:", disciplinas);
  }, [disciplinas]);

  useEffect(() => {
    if (formData.disciplinaId) {
      fetchTopicos(formData.disciplinaId);
    } else {
      setTopicos([]);
    }
  }, [formData.disciplinaId]);

  const fetchDisciplinas = async () => {
    try {
      setDisciplinasLoading(true);
      console.log("Buscando disciplinas do professor...");
      const response = await apiRequests.professor.getDisciplinas();
      console.log("Disciplinas do professor:", response);
      
      if (response.disciplinas && response.disciplinas.length > 0) {
        setDisciplinas(response.disciplinas);
      } else {
        // Se o professor não tem disciplinas associadas, buscar todas as disciplinas
        console.log("Professor sem disciplinas associadas, buscando todas...");
        const allDisciplinasResponse = await apiRequests.disciplina.getAll();
        console.log("Todas as disciplinas:", allDisciplinasResponse);
        setDisciplinas(allDisciplinasResponse.disciplinas || []);
      }
    } catch (error) {
      console.error("Erro ao carregar disciplinas do professor:", error);
      // Fallback: buscar todas as disciplinas
      try {
        console.log("Tentando fallback para todas as disciplinas...");
        const fallbackResponse = await apiRequests.disciplina.getAll();
        console.log("Fallback - todas as disciplinas:", fallbackResponse);
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
      // const response = await api.disciplina.getTopicos(disciplinaId);
      // setTopicos(response.topicos);
      setTopicos([]); // Por enquanto, array vazio
    } catch (error) {
      console.error("Erro ao carregar tópicos:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamanho do arquivo (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo permitido: 100MB");
        return;
      }

      // Validar tipo de arquivo
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'video/mp4',
        'video/avi',
        'video/mov',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipo de arquivo não suportado");
        return;
      }

      setFormData(prev => ({ ...prev, arquivo: file }));
    }
  };

  const uploadFile = async (file: File): Promise<{ fileKey: string; fileUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'conteudos');

      // Use the configured axios instance with progress tracking
      const response = await api.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            setUploadProgress(progress);
          }
        },
      });

      return {
        fileKey: response.data.fileKey,
        fileUrl: response.data.fileUrl
      };
    } catch (error) {
      console.error("Erro no upload:", error);
      throw new Error('Upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.tipo || !formData.disciplinaId) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.conteudoTexto && !formData.arquivo && !formData.linkExterno) {
      toast.error("Adicione pelo menos um conteúdo (texto, arquivo ou link)");
      return;
    }

    try {
      setLoading(true);
      let arquivoUrl = "";
      let tamanhoArquivo: number | undefined;
      let formatoArquivo: string | undefined;

      // Upload do arquivo se existir
      if (formData.arquivo) {
        toast.info("Fazendo upload do arquivo...");
        const uploadResult = await uploadFile(formData.arquivo);
        arquivoUrl = uploadResult.fileKey; // Store S3 key, not URL
        tamanhoArquivo = formData.arquivo.size;
        formatoArquivo = formData.arquivo.type;
      }

      // Criar conteúdo
      const conteudoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        disciplinaId: formData.disciplinaId,
        topicoId: formData.topicoId || undefined,
        conteudo: formData.conteudoTexto,
        arquivoUrl: arquivoUrl || formData.linkExterno,
        linkExterno: formData.linkExterno,
        tamanhoArquivo,
        formatoArquivo,
      };

      await apiRequests.professor.createConteudo(conteudoData);
      
      toast.success("Conteúdo criado com sucesso! Aguardando aprovação.");
      router.push("/dashboard/professor/conteudos");
      
    } catch (error) {
      console.error("Erro ao criar conteúdo:", error);
      toast.error("Erro ao criar conteúdo");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handlePreview = () => {
    // TODO: Implementar preview do conteúdo
    toast.info("Funcionalidade de preview em desenvolvimento");
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Criar Conteúdo</h1>
          <p className="text-gray-600">
            Adicione novo material educacional para seus estudantes
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
                    {disciplinas.length === 0 && !disciplinasLoading && (
                      <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-800 mb-1">
                              Nenhuma disciplina associada
                            </h4>
                            <p className="text-sm text-amber-700 mb-3">
                              Para criar conteúdos, você precisa primeiro se associar às disciplinas que leciona.
                            </p>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => router.push("/dashboard/professor/disciplinas/associar")}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Associar Disciplinas
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
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

                <div>
                  <Label htmlFor="linkExterno">Link Externo</Label>
                  <Input
                    id="linkExterno"
                    type="url"
                    value={formData.linkExterno}
                    onChange={(e) => handleInputChange("linkExterno", e.target.value)}
                    placeholder="https://exemplo.com/recurso (opcional)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload de Arquivo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload de Arquivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="arquivo">Selecionar Arquivo</Label>
                    <Input
                      id="arquivo"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif,.txt"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo: 100MB. Formatos: PDF, DOC, DOCX, MP4, AVI, MOV, JPG, PNG, GIF, TXT
                    </p>
                  </div>

                  {formData.arquivo && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{formData.arquivo.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enviando...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
                  {loading ? "Salvando..." : "Salvar Conteúdo"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  O conteúdo será enviado para aprovação antes de ficar disponível para os estudantes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}