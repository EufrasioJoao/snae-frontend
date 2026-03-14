

import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/lib/generated/prisma";

/**
 * Dashboard Layout para SNAE
 * Layout do dashboard com sidebar para todas as páginas internas
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  const prisma = new PrismaClient();

  // Buscar fornecedor do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { finishedOnboarding: true },
  });
  
  // Verificar se completou onboarding
  if (!user?.finishedOnboarding) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider defaultOpen={true} className="flex">
      <Sidebar />

      <main className="flex-1 flex flex-col p-0 bg-[#f7f9faeb] mt-0 w-full overflow-x-hidden">
        <div className="px-4 lg:px-10 max-w-full overflow-x-hidden">
          <div className="relative pt-24 md:pt-6 w-full overflow-x-auto overscroll-x-none pb-20 md:pb-0">
            <Header />
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
