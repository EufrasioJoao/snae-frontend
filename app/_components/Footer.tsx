"use client";

import Link from "next/link";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">SNAE</span>
                <p className="text-xs text-gray-400">Aprender Sempre</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sistema Nacional de Aprendizagem ao Estudante - Democratizando o acesso à educação de qualidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth" className="text-sm hover:text-blue-400 transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-sm hover:text-blue-400 transition-colors">
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link href="#recursos" className="text-sm hover:text-blue-400 transition-colors">
                  Recursos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Perguntas Frequentes
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-blue-400 transition-colors">
                  Contactar-nos
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>suporte@snae.gov.mz</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+258 XX XXX XXXX</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Maputo, Moçambique</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} SNAE. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Privacidade
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
