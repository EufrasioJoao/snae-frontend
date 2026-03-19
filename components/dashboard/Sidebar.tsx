"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  User,
  LogOut,
  BookOpen,
  Library,
  MessageCircleQuestion,
  GraduationCap,
  ClipboardList,
  Users,
  BarChart3,
  FileText,
  Award,
  BookMarked,
  Settings,
} from "lucide-react";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface NavGroup {
  group: string;
  links: NavLink[];
  roles?: string[];
}

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { setSidebarWidth, closeMobileSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);

  const userRole = user?.role || "USER";

  const navigationGroups: NavGroup[] = [
    {
      group: "Principal",
      links: [
        {
          name: "Painel",
          href: "/dashboard",
          icon: <LayoutDashboard size={20} />,
          roles: [],
        },
      ],
    },
    {
      group: "Aprendizagem",
      roles: ["ESTUDANTE"],
      links: [
        {
          name: "Assistente IA",
          href: "/dashboard/estudante/assistente",
          icon: <GraduationCap size={20} />,
          roles: ["ESTUDANTE"],
        },
        {
          name: "Biblioteca",
          href: "/dashboard/estudante/biblioteca",
          icon: <Library size={20} />,
          roles: ["ESTUDANTE"],
        },
        {
          name: "Minhas Disciplinas",
          href: "/dashboard/estudante/disciplinas",
          icon: <BookOpen size={20} />,
          roles: ["ESTUDANTE"],
        },
        {
          name: "Dúvidas",
          href: "/dashboard/estudante/duvidas",
          icon: <MessageCircleQuestion size={20} />,
          roles: ["ESTUDANTE"],
        },
        {
          name: "Avaliações",
          href: "/dashboard/estudante/avaliacoes",
          icon: <ClipboardList size={20} />,
          roles: ["ESTUDANTE"],
        },
        {
          name: "Meu Progresso",
          href: "/dashboard/estudante/progresso",
          icon: <Award size={20} />,
          roles: ["ESTUDANTE"],
        },
      ],
    },
    {
      group: "Ensino",
      roles: ["PROFESSOR"],
      links: [
        {
          name: "Minhas Disciplinas",
          href: "/dashboard/professor/disciplinas",
          icon: <BookMarked size={20} />,
          roles: ["PROFESSOR"],
        },
        {
          name: "Associar Disciplinas",
          href: "/dashboard/professor/disciplinas/associar",
          icon: <Settings size={20} />,
          roles: ["PROFESSOR"],
        },
        {
          name: "Dúvidas dos Alunos",
          href: "/dashboard/professor/duvidas",
          icon: <MessageCircleQuestion size={20} />,
          roles: ["PROFESSOR"],
        },
        {
          name: "Criar Avaliação",
          href: "/dashboard/professor/avaliacoes",
          icon: <ClipboardList size={20} />,
          roles: ["PROFESSOR"],
        },
        {
          name: "Conteúdos",
          href: "/dashboard/professor/conteudos",
          icon: <FileText size={20} />,
          roles: ["PROFESSOR"],
        },
      ],
    },
    {
      group: "Administração",
      roles: ["ADMIN"],
      links: [
        {
          name: "Utilizadores",
          href: "/dashboard/admin/users",
          icon: <Users size={20} />,
          roles: ["ADMIN"],
        },
        {
          name: "Disciplinas",
          href: "/dashboard/admin/disciplinas",
          icon: <BookOpen size={20} />,
          roles: ["ADMIN"],
        },
        {
          name: "Conteúdos",
          href: "/dashboard/admin/conteudos",
          icon: <Library size={20} />,
          roles: ["ADMIN"],
        },
        {
          name: "Relatórios",
          href: "/dashboard/admin/relatorios",
          icon: <BarChart3 size={20} />,
          roles: ["ADMIN"],
        },
      ],
    },
    {
      group: "Conta",
      links: [
        {
          name: "Meu Perfil",
          href: "/dashboard/profile",
          icon: <User size={20} />,
          roles: [],
        },
        {
          name: "Sair",
          href: "/auth/logout",
          icon: <LogOut size={20} />,
          roles: [],
        },
      ],
    },
  ];

  useEffect(() => {
    setSidebarWidth(isExpanded ? "16rem" : "70px");
  }, [isExpanded, setSidebarWidth]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    setSidebarWidth(!isExpanded ? "16rem" : "70px");
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      ADMIN: "Administrador",
      PROFESSOR: "Professor",
      ESTUDANTE: "Estudante",
      USER: "Utilizador",
    };
    return roleLabels[role] || role;
  };

  return (
    <ShadcnSidebar className="flex flex-col">
      <SidebarHeader className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-sidebar-foreground font-bold text-lg">
                SNAE
              </span>
              <p className="text-xs text-sidebar-foreground/60 -mt-0.5">
                Aprender Sempre
              </p>
            </div>
          </motion.div>
        )}
        <div className="flex items-center gap-2">
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent p-1.5 rounded-md transition-colors"
            >
              {isExpanded ? (
                <ChevronLeft size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>
          )}
        </div>
      </SidebarHeader>

      {user?.id && (
        <SidebarContent className="flex-1 py-4 overscroll-none">
          {navigationGroups.map((group) => {
            if (group.roles && group.roles.length > 0) {
              if (!group.roles.includes(userRole)) {
                return null;
              }
            }

            const visibleLinks = group.links.filter((link) => {
              if (!link.roles || link.roles.length === 0) {
                return true;
              }
              return link.roles.includes(userRole);
            });

            if (visibleLinks.length === 0) {
              return null;
            }

            return (
              <SidebarGroup key={group.group} className="w-full mb-2">
                {isExpanded && (
                  <SidebarGroupLabel className="px-4 mb-1 text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                    {group.group}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-0.5">
                    {visibleLinks.map((link) => {
                      const isActive = pathname === link.href;

                      return (
                        <SidebarMenuItem key={link.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={`w-full justify-start hover:bg-transparent ${isExpanded ? "px-3" : "justify-center px-2"
                              }`}
                          >
                            <Link
                              href={link.href}
                              onClick={(e) => {
                                if (isMobile) {
                                  e.preventDefault();
                                  closeMobileSidebar();
                                  setTimeout(() => {
                                    router.push(link.href);
                                  }, 150);
                                }
                              }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                                ? "bg-sidebar-accent text-sidebar-primary"
                                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                }`}
                            >
                              <div
                                className={`flex-shrink-0 ${isActive
                                  ? "text-sidebar-primary"
                                  : "text-sidebar-foreground/60"
                                  }`}
                              >
                                {link.icon}
                              </div>
                              {isExpanded && (
                                <span className={`text-sm font-medium`}>
                                  {link.name}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>
      )}

      {user && isExpanded && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {userRole && (
            <div className="mt-2 px-2 py-1 bg-blue-500/10 rounded-md">
              <p className="text-xs font-medium text-blue-600 text-center">
                {getRoleLabel(userRole)}
              </p>
            </div>
          )}
        </div>
      )}
    </ShadcnSidebar>
  );
};

export default Sidebar;
