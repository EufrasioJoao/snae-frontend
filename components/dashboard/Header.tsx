"use client";
import React from "react";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

/**
 * Header component para o dashboard do SNAE
 * Exibe informações do utilizador e opções de navegação
 */
const Header: React.FC = () => {
  const { user } = useAuth();

  // Retorna o nome de exibição do utilizador
  function userName() {
    if (!user?.name) return "Utilizador";
    const parts = user.name.split(" ");
    return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : parts[0];
  }

  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <div className="fixed inline-block md:hidden bg-white md:bg-transparent px-5 md:px-0 shadow md:shadow-none md:sticky left-0 top-0 z-50 w-full transition-all duration-300 py-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant={"secondary"}
            className="border inline-block bg-white text-black"
            onClick={() => setOpenMobile(!openMobile)}
          >
            <Menu />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* User dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="h-10 w-10 rounded-lg overflow-hidden border-2 border-blue-600 flex items-center justify-center cursor-pointer bg-white focus:outline-none hover:bg-blue-50 transition-colors"
                  aria-label="Abrir menu do utilizador"
                  type="button"
                >
                  <User size={20} className="text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/profile" className="w-full">
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-blue-600 cursor-pointer">
                  <Link href="/auth/logout" className="w-full cursor-pointer">
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
