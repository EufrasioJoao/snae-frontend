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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  BookOpen,
  Calendar,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { Quiz, Questao, TentativaQuiz } from "../_types/professor-avaliacao.types";
import AdicionarQuestaoModal from "./AdicionarQuestaoModal";

interface QuizModalProps {
  quiz: Quiz | null;
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export default function QuizModal({
  quiz,
  open,
  onClose,
  onRefresh
}: QuizModalProps) {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [tentativas, setTentativas] = useState<TentativaQuiz[]>([]);
  const [loadingQuestoes, setLoadingQuestoes] = useState(false);
  const [loadingTentativas, setLoadingTentativas] = useState(false);
  const [showAdicionarQuestao, setShowAdicionarQuestao] = useState(false);
  useEffect(() => {
    if (open && quiz) {
      fetchQuestoes();
      fetchTentativas();
    }
  }, [open, quiz]);

  const fetchQuestoes = async () => {
    if (!quiz) return;
    
    try {
      setLoadingQuestoes(true);
      const response = await apiRequests.professor.getQuestoesByQuiz(quiz.id);
      setQuestoes(response);
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      toast.error("Erro ao carregar questões");
    } finally {
      setLoadingQuestoes(false);
    }
  };

  const fetchTentativas = async () => {
    if (!quiz) return;
    
    try {
      setLoadingTentativas(true);
      const response = await apiRequests.professor.getTentativasByQuiz(quiz.id);
      setTentativas(response);
    } catch (error) {
      console.error("Erro ao carregar tentativas:", error);
      toast.error("Erro ao carregar tentativas");
    } finally {
      setLoadingTentativas(false);
    }
  };

  const getStatusBadge = (publicado: boolean) => {
    if (publicado) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Publicado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <FileText className="h-3 w-3 mr-1" />
        Rascunho
      </Badge>
    );
  };

  const formatNivelEnsino = (nivel: string) => {
    switch (nivel) {
      case "ENSINO_PRIMARIO":
        return "Ensino Primário";
      case "ENSINO_SECUNDARIO":
        return "Ensino Secundário";
      default:
        return nivel;
    }
  };
  const formatTipoQuestao = (tipo: string) => {
    switch (tipo) {
      case "MULTIPLA_ESCOLHA":
        return "Múltipla Escolha";
      case "VERDADEIRO_FALSO":
        return "Verdadeiro/Falso";
      case "DISSERTATIVA":
        return "Dissertativa";
      default:
        return tipo;
    }
  };

  const formatDificuldade = (dificuldade: string) => {
    switch (dificuldade) {
      case "FACIL":
        return "Fácil";
      case "MEDIO":
        return "Médio";
      case "DIFICIL":
        return "Difícil";
      default:
        return dificuldade;
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "FACIL":
        return "bg-green-100 text-green-800";
      case "MEDIO":
        return "bg-yellow-100 text-yellow-800";
      case "DIFICIL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleQuestaoAdicionada = () => {
    setShowAdicionarQuestao(false);
    fetchQuestoes();
    onRefresh();
  };

  const handleEditarQuestao = (questao: Questao) => {
    toast.info("Funcionalidade de edição em desenvolvimento");
  };

  const handleExcluirQuestao = async (questaoId: string) => {
    toast.info("Funcionalidade de exclusão em desenvolvimento");
  };

  const getRoleIcon = (role: string) => {
    return role === 'PROFESSOR' ? Users : Users;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'PROFESSOR') {
      return <Badge variant="default" className="text-xs">Professor</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Estudante</Badge>;
  };

  if (!quiz) return null;
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="truncate">{quiz.titulo}</span>
              </div>
              {getStatusBadge(quiz.publicado)}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[70vh]">
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{quiz.disciplina.nome}</p>
                    <p className="text-xs text-gray-500">
                      {formatNivelEnsino(quiz.disciplina.nivelEnsino)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(quiz.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    <p className="text-xs text-gray-500">Data de criação</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{quiz._count.questoes} questões</p>
                    <p className="text-xs text-gray-500">Total de questões</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{quiz._count.tentativas} tentativas</p>
                    <p className="text-xs text-gray-500">Realizadas pelos estudantes</p>
                  </div>
                </div>
              </div>
              {/* Descrição */}
              {quiz.descricao && (
                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <div className="p-4 bg-white border rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{quiz.descricao}</p>
                  </div>
                </div>
              )}

              {/* Configurações */}
              <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quiz.tempoLimite && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tempo limite: {quiz.tempoLimite} minutos</span>
                    </div>
                  )}
                  {quiz.notaMinima && (
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Nota mínima: {quiz.notaMinima}</span>
                    </div>
                  )}
                  {quiz.tentativasPermitidas && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Tentativas permitidas: {quiz.tentativasPermitidas}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Embaralhar questões: {quiz.embaralharQuestoes ? "Sim" : "Não"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Mostrar resultado: {quiz.mostrarResultado ? "Sim" : "Não"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Tabs para Questões e Tentativas */}
              <Tabs defaultValue="questoes" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questoes">
                    Questões ({quiz._count.questoes})
                  </TabsTrigger>
                  <TabsTrigger value="tentativas">
                    Tentativas ({quiz._count.tentativas})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="questoes" className="space-y-4">
                  {loadingQuestoes ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                  ) : (
                    <>
                      {/* Botão Adicionar Questão sempre visível */}
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700">
                          Questões ({questoes.length})
                        </h4>
                        <Button 
                          size="sm"
                          onClick={() => setShowAdicionarQuestao(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Questão
                        </Button>
                      </div>

                      {questoes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Nenhuma questão adicionada ainda.</p>
                          <p className="text-sm">Use o botão acima para adicionar a primeira questão.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {questoes.map((questao, index) => (
                            <div key={questao.id} className="border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-500">
                                    Questão {index + 1}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {formatTipoQuestao(questao.tipo)}
                                  </Badge>
                                  <Badge className={`text-xs ${getDificuldadeColor(questao.dificuldade)}`}>
                                    {formatDificuldade(questao.dificuldade)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500">{questao.pontos} pts</span>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => handleEditarQuestao(questao)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem 
                                        onClick={() => handleExcluirQuestao(questao.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Excluir
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                              
                              <p className="text-gray-700 mb-3">{questao.enunciado}</p>
                              
                              {questao.opcoes && (
                                <div className="space-y-1">
                                  {JSON.parse(questao.opcoes).map((opcao: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      <span className="text-gray-500">{String.fromCharCode(65 + idx)})</span>
                                      <span className={opcao.correta ? "font-medium text-green-700" : "text-gray-600"}>
                                        {opcao.texto}
                                      </span>
                                      {opcao.correta && <CheckCircle className="h-4 w-4 text-green-600" />}
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {questao.explicacao && (
                                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                                  <p className="text-sm text-blue-800">
                                    <strong>Explicação:</strong> {questao.explicacao}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="tentativas" className="space-y-4">
                  {loadingTentativas ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                  ) : tentativas.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhuma tentativa realizada ainda.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tentativas.map((tentativa) => (
                        <div key={tentativa.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{tentativa.estudante.name}</p>
                              <p className="text-sm text-gray-500">{tentativa.estudante.email}</p>
                              <p className="text-xs text-gray-500">
                                Iniciado: {format(new Date(tentativa.iniciado), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                              </p>
                            </div>
                            <div className="text-right">
                              {tentativa.nota !== null ? (
                                <>
                                  <p className="text-lg font-bold">
                                    {tentativa.nota?.toFixed(1)}/{tentativa.notaMaxima}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {tentativa.percentual?.toFixed(1)}%
                                  </p>
                                  {tentativa.aprovado !== null && (
                                    <Badge 
                                      variant={tentativa.aprovado ? "default" : "destructive"}
                                      className="text-xs mt-1"
                                    >
                                      {tentativa.aprovado ? "Aprovado" : "Reprovado"}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Em andamento
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
          <Separator />

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-500">
              Última atualização: {format(new Date(quiz.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Questão */}
      {showAdicionarQuestao && (
        <AdicionarQuestaoModal
          open={showAdicionarQuestao}
          onClose={() => setShowAdicionarQuestao(false)}
          onSuccess={handleQuestaoAdicionada}
          quizId={quiz.id}
          quizTitulo={quiz.titulo}
        />
      )}
    </>
  );
}