import { Metadata } from "next";
import DisciplinasClient from "./disciplinas-client";

export const metadata: Metadata = {
  title: "Minhas Disciplinas | SNAE Professor",
  description: "Gerir as disciplinas que você leciona no sistema SNAE",
};

export default function ProfessorDisciplinasPage() {
  return <DisciplinasClient />;
}