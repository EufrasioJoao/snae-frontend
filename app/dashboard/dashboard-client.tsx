"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "./_components/AdminDashboard";
import ProfessorDashboard from "./_components/ProfessorDashboard";
import EstudanteDashboard from "./_components/EstudanteDashboard";

export default function DashboardClientPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Renderizar dashboard baseado no role
  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard user={user} />;
    case 'PROFESSOR':
      return <ProfessorDashboard user={user} />;
    case 'ESTUDANTE':
      return <EstudanteDashboard user={user} />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Role não reconhecido
            </h2>
            <p className="text-gray-600">
              Entre em contato com o administrador do sistema.
            </p>
          </div>
        </div>
      );
  }
}
