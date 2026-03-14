"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import {
  Download,
  X,
  Sparkles,
  ArrowRight,
  Smartphone,
  Zap,
  Wifi,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Interface for the PWA context
 */
interface PWAContextType {
  isInstallable: boolean;
  showInstallPrompt: () => Promise<void>;
}

/**
 * Interface for the PWAWrapper component props
 */
interface PWAWrapperProps {
  children: React.ReactNode;
}

// Create context for PWA functionality
const PWAContext = createContext<PWAContextType>({
  isInstallable: false,
  showInstallPrompt: async () => {},
});

/**
 * Hook to use PWA installation functionality
 * @returns PWA context with installation status and prompt function
 */
export const usePWA = () => useContext(PWAContext);

/**
 * PWA wrapper component that handles app installation prompt
 *
 * @param {PWAWrapperProps} props - Component props
 * @returns {React.ReactElement} The wrapped children with PWA functionality
 */
export default function PWAWrapper({
  children,
}: PWAWrapperProps): React.ReactElement {
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [installationDismissed, setInstallationDismissed] =
    useState<boolean>(false);
  const [showFullScreenPrompt, setShowFullScreenPrompt] =
    useState<boolean>(false);

  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isHomePage =
    pathname === "/" ;

  // Handle installation prompt
  useEffect(() => {
    // Check if the user has previously dismissed the prompt
    const checkDismissed = () => {
      const dismissed = localStorage.getItem("pwa-dismissed");
      const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
      const currentTime = new Date().getTime();

      // If dismissed less than 3 days ago, don't show the prompt again
      if (
        dismissedTime &&
        currentTime - dismissedTime < 3 * 24 * 60 * 60 * 1000
      ) {
        setInstallationDismissed(true);
        return true;
      }
      return false;
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e);
      // Update installable state
      setIsInstallable(true);
    };

    // Only show if not previously dismissed
    if (!checkDismissed()) {
      // Listen for the beforeinstallprompt event
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      // Log app installed
      console.log("PWA foi instalado com sucesso");
      setIsInstallable(false);
      setDeferredPrompt(null);

      // Show success message
      showInstallationSuccess();
    });

    // Check if app is launched in standalone mode (already installed)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  // Display success message briefly after installation
  const showInstallationSuccess = () => {
    const successElement = document.createElement("div");
    successElement.className =
      "fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center";
    successElement.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      SNAE instalado com sucesso!
    `;
    document.body.appendChild(successElement);

    // Remove the message after 3 seconds
    setTimeout(() => {
      successElement.classList.add("opacity-0", "translate-y-[-10px]");
      successElement.style.transition =
        "opacity 0.3s ease, transform 0.3s ease";

      setTimeout(() => {
        document.body.removeChild(successElement);
      }, 300);
    }, 3000);
  };

  // Show prompt based on context and timing
  useEffect(() => {
    if (isInstallable && !installationDismissed) {
      // Different prompt strategies for different pages
      if (isDashboard) {
        // Show compact prompt on dashboard after a short delay
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      } else if (isHomePage) {
        // Show full-screen prompt on homepage after user has interacted with the site
        const showFullScreenTimer = setTimeout(() => {
          setShowFullScreenPrompt(true);
        }, 10000);
        return () => clearTimeout(showFullScreenTimer);
      }
    } else {
      setShowPrompt(false);
      setShowFullScreenPrompt(false);
    }
  }, [isDashboard, isHomePage, isInstallable, installationDismissed]);

  // Function to show installation prompt
  const showInstallPrompt = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;

    // Log outcome
    console.log(`Resultado da instalação: ${outcome}`);

    // Reset the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
    setShowFullScreenPrompt(false);
  };

  // Handle elegant closing with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPrompt(false);
      setShowFullScreenPrompt(false);
      setIsClosing(false);

      // Remember dismissal for 3 days
      localStorage.setItem("pwa-dismissed", new Date().getTime().toString());
      setInstallationDismissed(true);
    }, 300);
  };

  // Handle "Later" button click
  const handleLater = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPrompt(false);
      setShowFullScreenPrompt(false);
      setIsClosing(false);

      // Remember dismissal for 1 day
      const oneDayFromNow = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("pwa-dismissed", oneDayFromNow.toString());
      setInstallationDismissed(true);
    }, 300);
  };

  return (
    <PWAContext.Provider value={{ isInstallable, showInstallPrompt }}>
      {children}

      {/* Enhanced Compact Installation prompt for dashboard */}
      {showPrompt && !showFullScreenPrompt && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 max-w-[350px] transition-all duration-300",
            isClosing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}
        >
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-xl border border-blue-100 dark:border-slate-700 overflow-hidden animate-fade-in">
            {/* Decorative top bar */}
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            <div className="p-5">
              {/* Header with app icon */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="h-6 w-6 text-white">
                      <Image
                        src="/images/logo.png"
                        alt="SNAE Logo"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                    SNAE
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Instale o app para acesso rápido
                  </p>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="mb-4 space-y-2.5">
                <div className="flex items-start space-x-2.5">
                  <Smartphone
                    size={16}
                    className="mt-0.5 text-blue-500 flex-shrink-0"
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Acesso direto sem abrir o navegador
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Wifi
                    size={16}
                    className="mt-0.5 text-emerald-500 flex-shrink-0"
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Funciona offline para tarefas essenciais
                  </p>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Zap
                    size={16}
                    className="mt-0.5 text-amber-500 flex-shrink-0"
                  />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Desempenho 3x mais rápido que no navegador
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                  onClick={handleLater}
                >
                  Mais tarde
                </button>
                <button
                  className="cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all group"
                  onClick={showInstallPrompt}
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Instalar Agora
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen installation prompt for homepage/login */}
      {showFullScreenPrompt && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300",
            isClosing ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            {/* Decorative top bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors z-10"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center mb-5">
                <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden shadow-sm mr-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="h-8 w-8 text-white">
                      <Image
                        src="/images/logo.png"
                        alt="SNAE Logo"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-900 dark:text-white">
                    Instale o SNAE
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tenha acesso direto a todos os recursos
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap size={16} className="text-amber-500 mr-2" />
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Mais Rápido
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Carregamento instantâneo em seu dispositivo
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Bell size={16} className="text-red-500 mr-2" />
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Notificações
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Receba alertas de leads e vendas em tempo real
                  </p>
                </div>
              </div>

              {/* Install instructions */}
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/70 dark:to-slate-700/50 p-3 rounded-lg">
                <h4 className="font-medium text-slate-900 dark:text-white flex items-center mb-2">
                  <Sparkles size={16} className="text-amber-500 mr-2" />
                  Como funciona?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ao instalar, o SNAE funcionará como um app nativo no seu
                  dispositivo. Você terá um ícone na tela inicial para acesso
                  rápido, sem precisar abrir o navegador.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-3">
                <button
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
                  onClick={showInstallPrompt}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Instalar SNAE Agora
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors py-2"
                  onClick={handleLater}
                >
                  Lembrar mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}
