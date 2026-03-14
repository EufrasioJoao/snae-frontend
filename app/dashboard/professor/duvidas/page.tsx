import { Metadata } from "next";
import DuvidasClient from "./duvidas-client";

export const metadata: Metadata = {
  title: "Dúvidas dos Alunos | SNAE Professor",
  description: "Responda às dúvidas dos seus estudantes no sistema SNAE",
};

export default function ProfessorDuvidasPage() {
  return <DuvidasClient />;
}