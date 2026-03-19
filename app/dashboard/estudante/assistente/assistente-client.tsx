"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  BookOpen, 
  Sparkles,
  User,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./markdown-styles.css";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Disciplina {
  id: string;
  nome: string;
  nivelEnsino: string;
  areaConhecimento: {
    nome: string;
  };
}

export default function AssistenteClient() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<Disciplina | null>(null);
  const [mensagens, setMensagens] = useState<Message[]>([]);
  const [inputMensagem, setInputMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    // Auto-scroll para a última mensagem
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [mensagens, loading]);

  const fetchDisciplinas = async () => {
    try {
      setLoadingDisciplinas(true);
      const response = await apiRequests.estudante.getDisciplinas();
      // A API retorna disciplinasAssociadas com estrutura { disciplina: {...} }
      const disciplinasFormatadas = (response.disciplinas || []).map((item: any) => item.disciplina);
      setDisciplinas(disciplinasFormatadas);
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      toast.error("Erro ao carregar disciplinas");
    } finally {
      setLoadingDisciplinas(false);
    }
  };

  const handleSelecionarDisciplina = (disciplina: Disciplina) => {
    setDisciplinaSelecionada(disciplina);
    setMensagens([
      {
        role: "assistant",
        content: `Olá! Sou seu assistente de ${disciplina.nome}. Estou aqui para ajudar você a entender melhor os conceitos, tirar dúvidas e aprender de forma mais eficaz. Como posso ajudar você hoje?`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleEnviarMensagem = async () => {
    if (!inputMensagem.trim() || !disciplinaSelecionada) return;

    const novaMensagemUsuario: Message = {
      role: "user",
      content: inputMensagem,
      timestamp: new Date(),
    };

    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setInputMensagem("");
    setLoading(true);

    try {
      // Preparar histórico para enviar à API
      const historico = mensagens.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const data = await apiRequests.estudante.chatAssistente({
        disciplinaId: disciplinaSelecionada.id,
        mensagem: inputMensagem,
        historico,
      });

      if (data.success) {
        const novaMensagemAssistente: Message = {
          role: "assistant",
          content: data.resposta,
          timestamp: new Date(),
        };
        setMensagens(prev => [...prev, novaMensagemAssistente]);
        
        // Scroll para baixo após adicionar a mensagem
        setTimeout(() => {
          if (scrollRef.current) {
            const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollElement) {
              scrollElement.scrollTo({
                top: scrollElement.scrollHeight,
                behavior: 'smooth'
              });
            }
          }
        }, 100);
      } else {
        toast.error(data.error || "Erro ao enviar mensagem");
      }
    } catch (error: any) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage = error.response?.data?.error || error.message || "Erro ao enviar mensagem";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaConversa = () => {
    if (disciplinaSelecionada) {
      setMensagens([
        {
          role: "assistant",
          content: `Olá! Sou seu assistente de ${disciplinaSelecionada.nome}. Estou aqui para ajudar você a entender melhor os conceitos, tirar dúvidas e aprender de forma mais eficaz. Como posso ajudar você hoje?`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  if (!disciplinaSelecionada) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistente IA</h1>
            <p className="text-gray-600">Tire suas dúvidas com inteligência artificial</p>
          </div>
        </div>

        {/* Seleção de Disciplina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Selecione uma Disciplina
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDisciplinas ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : disciplinas.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Você ainda não está matriculado em nenhuma disciplina.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {disciplinas.map((disciplina) => (
                  <button
                    key={disciplina.id}
                    onClick={() => handleSelecionarDisciplina(disciplina)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      <Badge variant="outline" className="text-xs">
                        {disciplina.nivelEnsino === "ENSINO_PRIMARIO" ? "Primário" : "Secundário"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {disciplina.nome}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {disciplina.areaConhecimento?.nome || "Área não especificada"}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Box */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bot className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Como funciona o Assistente IA?
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Selecione uma disciplina para começar</li>
                  <li>• Faça perguntas sobre os conteúdos da disciplina</li>
                  <li>• Receba explicações personalizadas para o seu nível</li>
                  <li>• Tire dúvidas a qualquer momento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com disciplina selecionada */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assistente de {disciplinaSelecionada.nome}
            </h1>
            <p className="text-gray-600">{disciplinaSelecionada.areaConhecimento?.nome || "Área não especificada"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNovaConversa}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Nova Conversa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisciplinaSelecionada(null)}
          >
            Trocar Disciplina
          </Button>
        </div>
      </div>

      {/* Chat */}
      <Card className="h-[calc(100vh-280px)]">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Mensagens */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {mensagens.map((mensagem, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    mensagem.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {mensagem.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      mensagem.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {mensagem.role === "assistant" ? (
                      <div className="markdown-content">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {mensagem.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{mensagem.content}</p>
                    )}
                    <p
                      className={`text-xs mt-2 ${
                        mensagem.role === "user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {mensagem.timestamp.toLocaleTimeString("pt-MZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {mensagem.role === "user" && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMensagem}
                onChange={(e) => setInputMensagem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                onClick={handleEnviarMensagem}
                disabled={loading || !inputMensagem.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Pressione Enter para enviar, Shift+Enter para nova linha
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
