import { CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function StepComplete() {
  return (
    <div className="text-center space-y-8 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>

      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tudo Pronto! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Seu perfil foi configurado com sucesso. Você será redirecionado para o painel 
          em instantes...
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-blue-600">
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="font-medium">Preparando sua experiência</span>
        <Sparkles className="w-5 h-5 animate-pulse" />
      </div>

      {/* Loading Animation */}
      <div className="flex justify-center gap-2">
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="w-3 h-3 bg-blue-600 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    </div>
  );
}
