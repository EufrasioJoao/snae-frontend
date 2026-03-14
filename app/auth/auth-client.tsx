"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/actions/auth-actions";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowLeft, GraduationCap, BookOpen, Users, Award } from "lucide-react";
import Link from "next/link";

export default function AuthClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { logIn } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        const result = await signUp(
          formData.email,
          formData.password,
          formData.name
        );

        if (result.success && result.user) {
          toast.success("Conta criada com sucesso!");
          await logIn(result.user);
          location.href = "/onboarding";
        } else {
          const errorMsg = result.error || "Erro ao criar conta";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } else {
        const result = await signIn(formData.email, formData.password);

        if (result.success && result.user) {
          toast.success("Login realizado com sucesso!");
          await logIn(result.user);
          location.href = "/dashboard";
        } else {
          const errorMsg = result.error || "Email ou senha incorretos";
          setError(errorMsg);
          toast.error("Erro ao fazer login", {
            description: errorMsg,
          });
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
      setError(errorMessage);
      toast.error("Erro", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold">SNAE</span>
              <p className="text-sm text-blue-100">Aprender Sempre</p>
            </div>
          </Link>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Educação de Qualidade para Todos
              </h2>
              <p className="text-lg text-blue-100 leading-relaxed">
                Acesse conteúdos educacionais, tire dúvidas com professores e prepare-se para exames. 
                Tudo em uma plataforma inclusiva e acessível.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Biblioteca Digital</h3>
                  <p className="text-sm text-blue-100">Milhares de conteúdos educacionais organizados por disciplina</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Aprendizagem Colaborativa</h3>
                  <p className="text-sm text-blue-100">Interaja com professores e outros estudantes</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Acompanhe seu Progresso</h3>
                  <p className="text-sm text-blue-100">Monitore seu desempenho e evolução</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-blue-100">
            © {new Date().getFullYear()} SNAE - Sistema Nacional de Aprendizagem ao Estudante
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Back Button */}
        <div className="p-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Voltar</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="mb-8">
              {/* Mobile Logo */}
              <Link href="/" className="lg:hidden flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">SNAE</div>
                  <div className="text-xs text-gray-600">Aprender Sempre</div>
                </div>
              </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === "signin" ? "Bem-vindo de volta" : "Criar Conta"}
            </h1>
            <p className="text-gray-600">
              {mode === "signin"
                ? "Entre para acessar sua conta"
                : "Cadastre-se gratuitamente e comece a aprender"}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3.5 flex gap-3 mb-6">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Info Box */}
          {mode === "signup" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Cadastro Gratuito:</strong> Crie sua conta e tenha acesso 
                a todos os recursos educacionais da plataforma.
              </p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "signup" && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      placeholder="Seu nome completo"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={isLoading}
                    minLength={8}
                  />
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo de 8 caracteres
                  </p>
                )}

                {mode === "signin" && (
                  <div className="mt-2 text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md shadow-blue-500/20"
              >
                {isLoading
                  ? mode === "signin"
                    ? "Entrando..."
                    : "Criando conta..."
                  : mode === "signin"
                  ? "Entrar"
                  : "Criar Conta Grátis"}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {mode === "signin" ? (
                  <>
                    Não tem conta?{" "}
                    <span className="font-semibold text-blue-600">
                      Cadastre-se grátis
                    </span>
                  </>
                ) : (
                  <>
                    Já tem conta?{" "}
                    <span className="font-semibold text-blue-600">
                      Fazer login
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
