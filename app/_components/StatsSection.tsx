"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, MessageCircle, Award } from "lucide-react";

const stats = [
  {
    icon: BookOpen,
    value: "1000+",
    label: "Conteúdos Educacionais",
    description: "Livros, módulos e materiais",
  },
  {
    icon: Users,
    value: "500+",
    label: "Estudantes Ativos",
    description: "Aprendendo todos os dias",
  },
  {
    icon: MessageCircle,
    value: "2000+",
    label: "Dúvidas Respondidas",
    description: "Suporte contínuo",
  },
  {
    icon: Award,
    value: "95%",
    label: "Taxa de Satisfação",
    description: "Estudantes satisfeitos",
  },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Impacto Real na Educação
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Números que demonstram nosso compromisso com a educação de qualidade
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl mb-4">
                  <Icon className="w-8 h-8" />
                </div>

                <p className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </p>

                <p className="text-xl font-semibold mb-1">{stat.label}</p>

                <p className="text-blue-100 text-sm">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
