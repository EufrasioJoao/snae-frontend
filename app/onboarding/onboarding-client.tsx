"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/lib/api-requests";
import StepWelcome from "./_components/StepWelcome";
import StepSelectRole from "./_components/StepSelectRole";
import StepEstudante from "./_components/StepEstudante";
import StepProfessor from "./_components/StepProfessor";
import StepComplete from "./_components/StepComplete";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface OnboardingClientProps {
  user: User;
}

export type OnboardingData = {
  role?: "ESTUDANTE" | "PROFESSOR";
  // Estudante
  nivelEnsino?: "ENSINO_PRIMARIO" | "ENSINO_SECUNDARIO";
  anoEscolar?: number;
  escolaId?: string;
  escolaManual?: string;
  // Professor
  especialidade?: string;
  instituicao?: string;
  disciplinaIds?: string[];
};

export default function OnboardingClient({ user }: OnboardingClientProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({});

  const steps = [
    { id: "welcome", title: "Bem-vindo", component: StepWelcome },
    { id: "role", title: "Tipo de Conta", component: StepSelectRole },
    { 
      id: "details", 
      title: data.role === "ESTUDANTE" ? "Dados do Estudante" : "Dados do Professor",
      component: data.role === "ESTUDANTE" ? StepEstudante : StepProfessor 
    },
    { id: "complete", title: "Concluído", component: StepComplete },
  ];

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);

    try {
      // Validar que role está definido
      if (!data.role) {
        toast.error("Por favor, selecione o tipo de conta");
        setIsLoading(false);
        return;
      }

      const result = await api.user.onboarding(user.id, data as Required<Pick<OnboardingData, 'role'>> & OnboardingData);

      if (result.success) {
        toast.success("Onboarding completado com sucesso!");
        setCurrentStep(steps.length - 1); // Ir para step de conclusão
        setTimeout(() => {
          location.href="/dashboard";
        }, 2000);
      } else {
        toast.error(result.error || "Erro ao completar onboarding");
      }
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Erro ao completar onboarding";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setData({ ...data, ...newData });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress Bar */}
        {currentStep < steps.length - 1 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              {steps.slice(0, -1).map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 2 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      index <= currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        index < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              {steps.slice(0, -1).map((step) => (
                <span key={step.id} className="text-center flex-1">
                  {step.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                data={data}
                updateData={updateData}
                onNext={handleNext}
                onBack={handleBack}
                onComplete={handleComplete}
                isLoading={isLoading}
                user={user}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
