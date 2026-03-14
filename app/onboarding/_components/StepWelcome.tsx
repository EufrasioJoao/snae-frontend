import { GraduationCap, BookOpen, Users, Award } from "lucide-react";
import { OnboardingData } from "../onboarding-client";

interface StepWelcomeProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  user: { name: string };
}

export default function StepWelcome({ onNext, user }: StepWelcomeProps) {
  return (
    <div className="text-center space-y-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-4">
        <GraduationCap className="w-10 h-10 text-white" />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao SNAE, {user.name}!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sistema Nacional de Aprendizagem ao Estudante - Uma plataforma educacional 
          digital inclusiva que democratiza o acesso ao conhecimento.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 py-8">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Biblioteca Digital</h3>
          <p className="text-sm text-gray-600">
            Acesse milhares de conteúdos educacionais
          </p>
        </div>

        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Aprendizagem Colaborativa</h3>
          <p className="text-sm text-gray-600">
            Tire dúvidas com professores e colegas
          </p>
        </div>

        <div className="text-center">
          <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Award className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Acompanhe seu Progresso</h3>
          <p className="text-sm text-gray-600">
            Monitore seu desempenho e evolução
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg text-base font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
      >
        Começar
      </button>
    </div>
  );
}
