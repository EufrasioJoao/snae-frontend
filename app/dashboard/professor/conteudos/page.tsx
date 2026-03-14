import { Metadata } from "next";
import ConteudosClient from "./conteudos-client";

export const metadata: Metadata = {
  title: "Meus Conteúdos | SNAE Professor",
  description: "Gerir os conteúdos educacionais que você criou",
};

export default function ProfessorConteudosPage() {
  return <ConteudosClient />;
}