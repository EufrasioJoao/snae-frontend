import { Metadata } from "next";
import CriarConteudoClient from "./criar-conteudo-client";

export const metadata: Metadata = {
  title: "Criar Conteúdo | SNAE",
  description: "Criar novo conteúdo educacional",
};

export default function CriarConteudoPage() {
  return <CriarConteudoClient />;
}