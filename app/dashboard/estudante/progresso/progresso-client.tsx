"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Flame,
  Star,
  CheckCircle,
  Timer,
  Brain,
  Zap
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import apiRequests from "@/lib/api-requests";
import { 
  ProgressoGeral,
  ProgressoDisciplina,
  AtividadeRecente,
  Conquista,
  EstatisticasTempo,
  ProgressoFilters
} from "./_types/progresso.types";

export default function ProgressoClient() {
  const [progressoGeral, setProgressoGeral] = useState<ProgressoGeral | null>(null);
  const [progressoDisciplinas, setProgressoDisciplinas] = useState<ProgressoDisciplina[]>([]);
  const [atividadesRecentes, setAtividadesRecentes] = useState<AtividadeRecente[]>([]);
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [estatisticasTempo, setEstatisticasTempo] = useState<EstatisticasTempo | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProgressoFilters>({
    periodo: 'mes',
    disciplinaId: 'all',
    tipo: 'all'
  });

  useEffect(() => {
    fetchData();
  }, []); // Remover filters da dependência para evitar múltiplas chamadas

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fazer apenas uma chamada por vez para evitar sobrecarga
      const progressoGeralData = await apiRequests.estudante.getProgressoGeral();
      setProgressoGeral(progressoGeralData);
      
      const progressoDisciplinasData = await apiRequests.estudante.getProgressoDisciplinas();
      setProgressoDisciplinas(progressoDisciplinasData);
      
      const atividadesRecentesData = await apiRequests.estudante.getAtividadesRecentes({ limit: 10 });
      setAtividadesRecentes(atividadesRecentesData);
      
      const conquistasData = await apiRequests.estudante.getConquistas();
      setConquistas(conquistasData);
      
      const estatisticasTempoData = await apiRequests.estudante.getEstatisticasTempo(filters.periodo);
      setEstatisticasTempo(estatisticasTempoData);

    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      toast.error("Erro ao carregar dados de progresso");
    } finally {
      setLoading(false);
    }
  };

  const formatTempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    if (horas > 0) {
      return `${horas}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getConquistaIcon = (icone: string) => {
    switch (icone) {
      case 'trophy': return Trophy;
      case 'flame': return Flame;
      case 'brain': return Brain;
      case 'star': return Star;
      case 'zap': return Zap;
      default: return Award;
    }
  };

  const getNivelProgress = () => {
    if (!progressoGeral) return 0;
    const progressoAtual = progressoGeral.pontosTotal - (progressoGeral.nivel - 1) * 500;
    const progressoNecessario = progressoGeral.proximoNivel - (progressoGeral.nivel - 1) * 500;
    return (progressoAtual / progressoNecessario) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Progresso</h1>
          <p className="text-gray-600">Acompanhe seu desenvolvimento acadêmico</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={filters.periodo}
            onValueChange={(value) => setFilters(prev => ({ ...prev, periodo: value as any }))}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mês</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="ano">Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards de Resumo */}
      {progressoGeral && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nível Atual</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Nível {progressoGeral.nivel}</div>
              <div className="space-y-2 mt-2">
                <Progress value={getNivelProgress()} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {progressoGeral.pontosTotal} / {progressoGeral.proximoNivel} pontos
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressoGeral.mediaGeral.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                {progressoGeral.taxaAprovacao}% de aprovação
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo de Estudo</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTempo(progressoGeral.tempoTotalEstudo)}</div>
              <p className="text-xs text-muted-foreground">
                Total acumulado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sequência</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressoGeral.sequenciaAtual} dias</div>
              <p className="text-xs text-muted-foreground">
                Recorde: {progressoGeral.melhorSequencia} dias
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs de Conteúdo */}
      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Estatísticas de Tempo */}
            {estatisticasTempo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Tempo de Estudo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Hoje</p>
                      <p className="text-lg font-semibold">{formatTempo(estatisticasTempo.hoje)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Esta semana</p>
                      <p className="text-lg font-semibold">{formatTempo(estatisticasTempo.semana)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Este mês</p>
                      <p className="text-lg font-semibold">{formatTempo(estatisticasTempo.mes)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Média diária</p>
                      <p className="text-lg font-semibold">{formatTempo(Math.round(estatisticasTempo.mediaDiaria))}</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Melhor dia:</strong> {format(new Date(estatisticasTempo.melhorDia.data), "dd/MM/yyyy", { locale: ptBR })} 
                      - {formatTempo(estatisticasTempo.melhorDia.tempo)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progresso por Disciplina (Resumo) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Progresso por Disciplina
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressoDisciplinas.slice(0, 3).map((disciplina) => (
                  <div key={disciplina.disciplinaId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{disciplina.disciplinaNome}</span>
                      <span className="text-sm text-gray-500">{disciplina.progresso}%</span>
                    </div>
                    <Progress value={disciplina.progresso} className="h-2" />
                  </div>
                ))}
                
                {progressoDisciplinas.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Ver todas as disciplinas
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disciplinas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressoDisciplinas.map((disciplina) => (
              <Card key={disciplina.disciplinaId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{disciplina.disciplinaNome}</CardTitle>
                    <Badge variant="outline">{disciplina.nivelEnsino}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{disciplina.areaConhecimento}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso</span>
                      <span>{disciplina.progresso}%</span>
                    </div>
                    <Progress value={disciplina.progresso} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Quizzes</p>
                      <p className="font-medium">{disciplina.quizzesRealizados}/{disciplina.totalQuizzes}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Média</p>
                      <p className="font-medium">{disciplina.mediaNotas.toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tempo</p>
                      <p className="font-medium">{formatTempo(disciplina.tempoEstudo)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Última atividade</p>
                      <p className="font-medium">
                        {format(new Date(disciplina.ultimaAtividade), "dd/MM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  {disciplina.conquistas.length > 0 && (
                    <div className="flex gap-1">
                      {disciplina.conquistas.map((conquistaId) => {
                        const conquista = conquistas.find(c => c.id === conquistaId);
                        if (!conquista) return null;
                        const IconComponent = getConquistaIcon(conquista.icone);
                        return (
                          <div key={conquistaId} className="p-1 bg-yellow-100 rounded">
                            <IconComponent className="h-3 w-3 text-yellow-600" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="conquistas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conquistas.map((conquista) => {
              const IconComponent = getConquistaIcon(conquista.icone);
              return (
                <Card key={conquista.id} className={conquista.desbloqueada ? "border-yellow-200 bg-yellow-50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${conquista.desbloqueada ? "bg-yellow-200" : "bg-gray-200"}`}>
                        <IconComponent className={`h-4 w-4 ${conquista.desbloqueada ? "text-yellow-600" : "text-gray-400"}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{conquista.nome}</h3>
                        <p className="text-sm text-gray-600 mb-2">{conquista.descricao}</p>
                        
                        {conquista.desbloqueada ? (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Desbloqueada em {format(new Date(conquista.dataDesbloqueio!), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        ) : conquista.progresso !== undefined ? (
                          <div className="space-y-1">
                            <Progress value={conquista.progresso} className="h-1" />
                            <p className="text-xs text-gray-500">
                              {conquista.progresso}% completo
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400">Não desbloqueada</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="atividades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atividadesRecentes.map((atividade) => (
                  <div key={atividade.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      {atividade.tipo === 'QUIZ' && <Target className="h-4 w-4 text-blue-600" />}
                      {atividade.tipo === 'DUVIDA' && <Brain className="h-4 w-4 text-blue-600" />}
                      {atividade.tipo === 'CONTEUDO' && <BookOpen className="h-4 w-4 text-blue-600" />}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{atividade.titulo}</h4>
                      <p className="text-sm text-gray-500">{atividade.disciplina}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(atividade.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    
                    {atividade.resultado && (
                      <div className="text-right">
                        {atividade.resultado.nota && (
                          <p className="text-sm font-medium">
                            Nota: {atividade.resultado.nota}/20
                          </p>
                        )}
                        {atividade.resultado.aprovado !== undefined && (
                          <Badge variant={atividade.resultado.aprovado ? "default" : "destructive"} className="text-xs">
                            {atividade.resultado.aprovado ? "Aprovado" : "Reprovado"}
                          </Badge>
                        )}
                        {atividade.resultado.tempo && (
                          <p className="text-xs text-gray-500">
                            {atividade.resultado.tempo} min
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}