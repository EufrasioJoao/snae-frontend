"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Library,
  MessageCircleQuestion,
  CircleUser,
  BookOpen,
  Users,
  ClipboardList,
  BarChart3,
  Award,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.role || "USER";

  // Definir itens de navegação baseados no role
  const getNavItems = () => {
    switch (userRole) {
      case "ADMIN":
        return [
          {
            name: "Início",
            href: "/dashboard",
            icon: LayoutGrid,
          },
          {
            name: "Utilizadores",
            href: "/dashboard/admin/users",
            icon: Users,
          },
          {
            name: "Disciplinas",
            href: "/dashboard/admin/disciplinas",
            icon: BookOpen,
          },
          {
            name: "Relatórios",
            href: "/dashboard/admin/relatorios",
            icon: BarChart3,
          },
        ];

      case "PROFESSOR":
        return [
          {
            name: "Início",
            href: "/dashboard",
            icon: LayoutGrid,
          },
          {
            name: "Disciplinas",
            href: "/dashboard/professor/disciplinas",
            icon: BookOpen,
          },
          {
            name: "Dúvidas",
            href: "/dashboard/professor/duvidas",
            icon: MessageCircleQuestion,
          },
          {
            name: "Avaliações",
            href: "/dashboard/professor/avaliacoes",
            icon: ClipboardList,
          },
        ];

      case "ESTUDANTE":
        return [
          {
            name: "Início",
            href: "/dashboard",
            icon: LayoutGrid,
          },
          {
            name: "Biblioteca",
            href: "/dashboard/estudante/biblioteca",
            icon: Library,
          },
          {
            name: "Dúvidas",
            href: "/dashboard/estudante/duvidas",
            icon: MessageCircleQuestion,
          },
          {
            name: "Progresso",
            href: "/dashboard/estudante/progresso",
            icon: Award,
          },
        ];

      default:
        return [
          {
            name: "Início",
            href: "/dashboard",
            icon: LayoutGrid,
          },
          {
            name: "Perfil",
            href: "/dashboard/profile",
            icon: CircleUser,
          },
        ];
    }
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-1 ${active ? "text-blue-600" : "text-gray-500"
                  }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-blue-600" : "text-gray-500"
                    }`}
                />
                <span
                  className={`text-xs font-medium ${active ? "text-blue-600" : "text-gray-600"
                    }`}
                >
                  {item.name}
                </span>
              </motion.div>

              {active && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
