"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>Educação para Todos</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Aprenda Sempre,
              <span className="text-blue-600"> Em Qualquer Lugar</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              O SNAE é uma plataforma educacional digital que democratiza o acesso ao conhecimento. 
              Acesse conteúdos educacionais, tire dúvidas com professores e prepare-se para exames, 
              mesmo com conectividade limitada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg text-base font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="#recursos"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-lg text-base font-semibold border-2 border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105"
              >
                Saber Mais
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bem-vindo ao</p>
                    <p className="font-bold text-gray-900">SNAE</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-3 bg-gray-100 rounded-full w-4/5"></div>
                  <div className="h-3 bg-blue-200 rounded-full w-3/5"></div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4"
            >
              <p className="text-2xl font-bold text-blue-600">1000+</p>
              <p className="text-xs text-gray-600">Conteúdos</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4"
            >
              <p className="text-2xl font-bold text-green-600">24/7</p>
              <p className="text-xs text-gray-600">Disponível</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
