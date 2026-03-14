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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Send,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { QuestaoQuiz, RespostaEstudante } from "../_types/estudante-avaliacao.types";

interface RealizarQuizModalProps {
  quizId: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface QuizData {
  id: string;
  titulo: string;
  descricao?: string;
  disciplina: {
    nome: string;
    nivelEnsino: string;
  };
  tempoLimite?: number;
  questoes: QuestaoQuiz[];
  _count: {
    questoes: number;
  };
}

export default function RealizarQuizModal({
  quizId,
  open,
  onClose,
  onSuccess
}: RealizarQuizModalProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [tentativaId, setTentativaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [respostas, setRespostas] = useState<RespostaEstudante[]>([]);
  const [tempoRestante, setTempoRestante] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && quizId) {
      fetchQuiz();
    } else {
      resetState();
    }
  }, [open, quizId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (iniciado && tempoRestante !== null && tempoRestante > 0) {
      interval = setInterval(() => {
        setTempoRestante(prev => {
          if (prev === null || prev <= 1) {
            handleSubmitQuiz(); // Auto-submit quando tempo acabar
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [iniciado, tempoRestante]);

  const resetState = () => {
    setQuiz(null);
    setTentativaId(null);
    setIniciado(false);
    setRespostas([]);
    setTempoRestante(null);
    setSubmitting(false);
  };

  const fetchQuiz = async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      const quizData = await apiRequests.estudante.getQuizById(quizId);
      setQuiz(quizData);
      
      // Inicializar respostas vazias
      const respostasIniciais = quizData.questoes.map((questao: QuestaoQuiz) => ({
        questaoId: questao.id,
        resposta: questao.tipo === 'MULTIPLA_ESCOLHA' ? '' : ''
      }));
      setRespostas(respostasIniciais);
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
      toast.error("Erro ao carregar quiz");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarQuiz = async () => {
    if (!quizId) return;
    
    try {
      setLoading(true);
      const response = await apiRequests.estudante.iniciarQuiz(quizId);
      setTentativaId(response.tentativaId);
      setIniciado(true);
      
      if (quiz?.tempoLimite) {
        setTempoRestante(quiz.tempoLimite * 60); // Converter minutos para segundos
      }
      
      toast.success("Quiz iniciado! Boa sorte!");
    } catch (error: any) {
      console.error("Erro ao iniciar quiz:", error);
      toast.error(error.response?.data?.error || "Erro ao iniciar quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleRespostaChange = (questaoId: string, resposta: string | string[]) => {
    setRespostas(prev => 
      prev.map(r => 
        r.questaoId === questaoId 
          ? { ...r, resposta: Array.isArray(resposta) ? resposta.join(',') : resposta }
          : r
      )
    );
  };

  const handleSubmitQuiz = async () => {
    if (!quizId || !tentativaId) return;
    
    try {
      setSubmitting(true);
      const response = await apiRequests.estudante.submeterQuiz(quizId, respostas);
      
      toast.success("Quiz submetido com sucesso!");
      onSuccess();
      onClose();
      
      if (response.mostrarResultado) {
        toast.success(`Sua nota: ${response.nota}/${response.notaMaxima} (${response.percentual}%)`);
      }
    } catch (error: any) {
      console.error("Erro ao submeter quiz:", error);
      toast.error(error.response?.data?.error || "Erro ao submeter quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const getTempoColor = () => {
    if (!tempoRestante || !quiz?.tempoLimite) return "text-gray-600";
    const percentual = tempoRestante / (quiz.tempoLimite * 60);
    if (percentual > 0.5) return "text-green-600";
    if (percentual > 0.2) return "text-yellow-600";
    return "text-red-600";
  };

  if (!quiz) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{quiz.titulo}</h2>
              <p className="text-sm text-gray-500">{quiz.disciplina.nome}</p>
            </div>
            
            {iniciado && tempoRestante !== null && (
              <div className={`flex items-center gap-2 ${getTempoColor()}`}>
                <Timer className="h-4 w-4" />
                <span className="font-mono text-lg">{formatTempo(tempoRestante)}</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[70vh]">
          {!iniciado ? (
            // Tela de início
            <div className="space-y-6 p-4">
              {quiz.descricao && (
                <div>
                  <h3 className="font-medium mb-2">Descrição</h3>
                  <p className="text-gray-700">{quiz.descricao}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">{quiz._count.questoes} questões</p>
                    <p className="text-xs text-gray-500">Total de questões</p>
                  </div>
                </div>

                {quiz.tempoLimite && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{quiz.tempoLimite} minutos</p>
                      <p className="text-xs text-gray-500">Tempo limite</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 border-l-4 border-blue-200 rounded">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Certifique-se de que tem uma conexão estável antes de iniciar o quiz.
                </p>
              </div>
            </div>
          ) : (
            // Questões do quiz
            <div className="space-y-6 p-4">
              {quiz.questoes.map((questao, index) => (
                <div key={questao.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Questão {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {questao.pontos} pts
                        </Badge>
                      </div>
                      <p className="text-gray-900 mb-4">{questao.enunciado}</p>
                    </div>
                  </div>

                  {questao.tipo === 'MULTIPLA_ESCOLHA' && questao.opcoes && (
                    <RadioGroup
                      value={(() => {
                        const resposta = respostas.find(r => r.questaoId === questao.id)?.resposta;
                        return Array.isArray(resposta) ? resposta[0] || '' : resposta || '';
                      })()}
                      onValueChange={(value) => handleRespostaChange(questao.id, value)}
                    >
                      <div className="space-y-2">
                        {questao.opcoes.map((opcao, idx) => (
                          <div key={opcao.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={opcao.texto} id={`${questao.id}-${idx}`} />
                            <Label htmlFor={`${questao.id}-${idx}`} className="flex-1 cursor-pointer">
                              <span className="text-gray-500 mr-2">{String.fromCharCode(65 + idx)})</span>
                              {opcao.texto}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}

                  {questao.tipo === 'VERDADEIRO_FALSO' && (
                    <RadioGroup
                      value={(() => {
                        const resposta = respostas.find(r => r.questaoId === questao.id)?.resposta;
                        return Array.isArray(resposta) ? resposta[0] || '' : resposta || '';
                      })()}
                      onValueChange={(value) => handleRespostaChange(questao.id, value)}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Verdadeiro" id={`${questao.id}-v`} />
                          <Label htmlFor={`${questao.id}-v`} className="cursor-pointer">Verdadeiro</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Falso" id={`${questao.id}-f`} />
                          <Label htmlFor={`${questao.id}-f`} className="cursor-pointer">Falso</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}

                  {questao.tipo === 'DISSERTATIVA' && (
                    <Textarea
                      placeholder="Digite sua resposta..."
                      value={(() => {
                        const resposta = respostas.find(r => r.questaoId === questao.id)?.resposta;
                        return Array.isArray(resposta) ? resposta.join(' ') : resposta || '';
                      })()}
                      onChange={(e) => handleRespostaChange(questao.id, e.target.value)}
                      rows={4}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <div className="flex justify-between items-center pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading || submitting}>
            {iniciado ? "Cancelar" : "Fechar"}
          </Button>
          
          <div className="flex gap-2">
            {!iniciado ? (
              <Button onClick={handleIniciarQuiz} disabled={loading}>
                <Play className="h-4 w-4 mr-2" />
                {loading ? "Iniciando..." : "Iniciar Quiz"}
              </Button>
            ) : (
              <Button onClick={handleSubmitQuiz} disabled={submitting}>
                <Send className="h-4 w-4 mr-2" />
                {submitting ? "Submetendo..." : "Submeter Quiz"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}