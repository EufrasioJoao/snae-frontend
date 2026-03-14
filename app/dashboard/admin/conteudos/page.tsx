import { Metadata } from "next";
import ConteudosClient from "./conteudos-client";

export const metadata: Metadata = {
  title: "Gestão de Conteúdos | SNAE Admin",
  description: "Gerir conteúdos educacionais do sistema SNAE",
};

export default function ConteudosPage() {
  return <ConteudosClient />;
}