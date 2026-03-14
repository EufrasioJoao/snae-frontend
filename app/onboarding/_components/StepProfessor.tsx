import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { OnboardingData } from "../onboarding-client";
import EscolaSelector from "./EscolaSelector";

interface StepProfessorProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export default function StepProfessor({ data, updateData, onBack, onComplete, isLoading }: StepProfessorProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.especialidade || data.especialidade.trim() === "") {
      newErrors.especialidade = "Especialidade é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Dados do Professor
        </h2>
        <p className="text-gray-600">
          Precisamos de algumas informações para personalizar sua experiência
        </p>
      </div>

      {/* Especialidade */}
      <div>
        <label htmlFor="especialidade" className="block text-sm font-medium text-gray-700 mb-2">
          Especialidade / Área de Ensino <span className="text-red-500">*</span>
        </label>
        <input
          id="especialidade"
          type="text"
          value={data.especialidade || ""}
          onChange={(e) => updateData({ especialidade: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          placeholder="Ex: Matemática, Português, Ciências..."
          required
        />
        {errors.especialidade && (
          <p className="text-sm text-red-600 mt-1">{errors.especialidade}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Informe a principal área em que você leciona
        </p>
      </div>

      {/* Escola */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escola / Instituição (Opcional)
        </label>
        <EscolaSelector
          value={data.escolaId}
          manualValue={data.instituicao}
          onChange={(escolaId, escolaManual) => {
            updateData({ escolaId, instituicao: escolaManual });
          }}
          tipoEscola="PRIMARIA_SECUNDARIA"
        />
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Nota:</strong> Após completar o cadastro, você poderá adicionar as disciplinas 
          que leciona e começar a responder dúvidas dos estudantes.
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : "Concluir"}
        </button>
      </div>
    </form>
  );
}
