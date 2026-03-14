import { Metadata } from "next";
import DisciplinasClient from "./disciplinas-client";

export const metadata: Metadata = {
  title: "Minhas Disciplinas - SNAE",
  description: "Gerencie suas disciplinas de interesse",
};

export default function DisciplinasPage() {
  return <DisciplinasClient />;
}