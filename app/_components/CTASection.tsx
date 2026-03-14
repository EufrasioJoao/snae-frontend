"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Pronto para Transformar sua Aprendizagem?
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de estudantes que já estão aproveitando uma educação 
            de qualidade, acessível e inclusiva. Comece sua jornada de aprendizagem hoje mesmo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg text-base font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
            >
              Criar Conta Gratuita
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg text-base font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105"
            >
              Já tenho conta
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Gratuito para sempre • Sem cartão de crédito • Acesso imediato
          </p>
        </motion.div>
      </div>
    </section>
  );
}
