import { GraduationCap, BookOpen, ChevronRight } from "lucide-react";
import { OnboardingData } from "../onboarding-client";

interface StepSelectRoleProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepSelectRole({ data, updateData, onNext, onBack }: StepSelectRoleProps) {
  const handleSelectRole = (role: "ESTUDANTE" | "PROFESSOR") => {
    updateData({ role });
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Que tipo de conta deseja criar?
        </h2>
        <p className="text-gray-600">
          Escolha o perfil que melhor se adequa a você
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Estudante */}
        <button
          onClick={() => handleSelectRole("ESTUDANTE")}
          className={`group relative bg-white border-2 rounded-xl p-8 text-left transition-all hover:shadow-xl hover:scale-105 ${
            data.role === "ESTUDANTE"
              ? "border-blue-600 shadow-lg"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">Estudante</h3>
          <p className="text-gray-600 mb-4">
            Acesse conteúdos educacionais, tire dúvidas e prepare-se para exames
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              Biblioteca digital completa
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              Sistema de dúvidas
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              Quizzes e avaliações
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-blue-600" />
              Acompanhamento de progresso
            </li>
          </ul>
        </button>

        {/* Professor */}
        <button
          onClick={() => handleSelectRole("PROFESSOR")}
          className={`group relative bg-white border-2 rounded-xl p-8 text-left transition-all hover:shadow-xl hover:scale-105 ${
            data.role === "PROFESSOR"
              ? "border-green-600 shadow-lg"
              : "border-gray-200 hover:border-green-300"
          }`}
        >
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-8 h-8 text-green-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">Professor</h3>
          <p className="text-gray-600 mb-4">
            Apoie estudantes, responda dúvidas e crie conteúdos educacionais
          </p>

          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-green-600" />
              Responder dúvidas dos alunos
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-green-600" />
              Criar avaliações e quizzes
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-green-600" />
              Adicionar conteúdos educacionais
            </li>
            <li className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-green-600" />
              Acompanhar desempenho dos alunos
            </li>
          </ul>
        </button>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
