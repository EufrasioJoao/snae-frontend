import { Metadata } from "next";
import EstudanteDuvidasClient from "./duvidas-client";

export const metadata: Metadata = {
  title: "Minhas Dúvidas | SNAE",
  description: "Gerencie suas dúvidas acadêmicas e obtenha respostas de professores",
};

export default function EstudanteDuvidasPage() {
  return <EstudanteDuvidasClient />;
}