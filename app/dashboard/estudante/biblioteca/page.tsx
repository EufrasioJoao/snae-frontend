import { Metadata } from "next";
import BibliotecaClient from "./biblioteca-client";

export const metadata: Metadata = {
  title: "Biblioteca Digital | SNAE",
  description: "Acesse conteúdos educacionais, livros, módulos e materiais de apoio",
};

export default function BibliotecaPage() {
  return <BibliotecaClient />;
}