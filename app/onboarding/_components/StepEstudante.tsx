import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { OnboardingData } from "../onboarding-client";
import EscolaSelector from "./EscolaSelector";

interface StepEstudanteProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  onComplete: () => void;
  isLoading: boolean;
}

export default function StepEstudante({ data, updateData, onBack, onComplete, isLoading }: StepEstudanteProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.nivelEnsino) {
      newErrors.nivelEnsino = "Selecione o nível de ensino";
    }

    if (!data.anoEscolar) {
      newErrors.anoEscolar = "Selecione o ano escolar";
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

  const getTipoEscola = () => {
    if (data.nivelEnsino === "ENSINO_PRIMARIO") return "PRIMARIA";
    if (data.nivelEnsino === "ENSINO_SECUNDARIO") return "SECUNDARIA";
    return "PRIMARIA_SECUNDARIA";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Dados do Estudante
        </h2>
        <p className="text-gray-600">
          Precisamos de algumas informações para personalizar sua experiência
        </p>
      </div>

      {/* Nível de Ensino */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Nível de Ensino <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateData({ nivelEnsino: "ENSINO_PRIMARIO" })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              data.nivelEnsino === "ENSINO_PRIMARIO"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold text-gray-900">Ensino Primário</div>
            <div className="text-sm text-gray-600">1ª a 7ª classe</div>
          </button>

          <button
            type="button"
            onClick={() => updateData({ nivelEnsino: "ENSINO_SECUNDARIO" })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              data.nivelEnsino === "ENSINO_SECUNDARIO"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div className="font-semibold text-gray-900">Ensino Secundário</div>
            <div className="text-sm text-gray-600">8ª a 12ª classe</div>
          </button>
        </div>
        {errors.nivelEnsino && (
          <p className="text-sm text-red-600 mt-1">{errors.nivelEnsino}</p>
        )}
      </div>

      {/* Ano Escolar */}
      <div>
        <label htmlFor="anoEscolar" className="block text-sm font-medium text-gray-700 mb-2">
          Ano Escolar (Classe) <span className="text-red-500">*</span>
        </label>
        <select
          id="anoEscolar"
          value={data.anoEscolar || ""}
          onChange={(e) => updateData({ anoEscolar: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option value="">Selecione a classe</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((ano) => (
            <option key={ano} value={ano}>
              {ano}ª Classe
            </option>
          ))}
        </select>
        {errors.anoEscolar && (
          <p className="text-sm text-red-600 mt-1">{errors.anoEscolar}</p>
        )}
      </div>

      {/* Escola */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escola (Opcional)
        </label>
        <EscolaSelector
          value={data.escolaId}
          manualValue={data.escolaManual}
          onChange={(escolaId, escolaManual) => {
            updateData({ escolaId, escolaManual });
          }}
          tipoEscola={getTipoEscola() as any}
        />
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
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Salvando..." : "Concluir"}
        </button>
      </div>
    </form>
  );
}
