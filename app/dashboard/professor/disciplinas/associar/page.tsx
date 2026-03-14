import { Metadata } from "next";
import AssociarDisciplinasClient from "./associar-disciplinas-client";

export const metadata: Metadata = {
  title: "Associar Disciplinas | SNAE",
  description: "Associe-se às disciplinas que você leciona",
};

export default function AssociarDisciplinasPage() {
  return <AssociarDisciplinasClient />;
}