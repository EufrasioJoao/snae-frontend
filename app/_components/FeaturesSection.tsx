"use client";

import {
  Library,
  MessageCircleQuestion,
  ClipboardList,
  Wifi,
  Users,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Library,
    title: "Biblioteca Digital",
    description:
      "Acesse livros escolares, módulos de aprendizagem e materiais complementares organizados por disciplina e nível de ensino.",
    color: "blue",
  },
  {
    icon: MessageCircleQuestion,
    title: "Tire Dúvidas",
    description:
      "Faça perguntas e receba respostas de professores especializados, outros estudantes ou assistência automatizada.",
    color: "green",
  },
  {
    icon: ClipboardList,
    title: "Avaliações e Quizzes",
    description:
      "Prepare-se para exames com questionários, exercícios de revisão e simulações de testes para avaliar seu conhecimento.",
    color: "purple",
  },
  {
    icon: Wifi,
    title: "Modo Offline",
    description:
      "Continue estudando mesmo sem internet. Conteúdos baixados ficam disponíveis para consulta a qualquer momento.",
    color: "orange",
  },
  {
    icon: Users,
    title: "Aprendizagem Colaborativa",
    description:
      "Interaja com professores e colegas em um ambiente de aprendizagem colaborativa que estimula o pensamento crítico.",
    color: "pink",
  },
  {
    icon: Award,
    title: "Acompanhe seu Progresso",
    description:
      "Monitore seu desempenho, tempo de estudo e conclusão de conteúdos para identificar áreas de melhoria.",
    color: "indigo",
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
  green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
  pink: { bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
};

export default function FeaturesSection() {
  return (
    <section id="recursos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos que Transformam a Aprendizagem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa pensada para apoiar estudantes em todas as etapas do processo educativo
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 ${colors.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
