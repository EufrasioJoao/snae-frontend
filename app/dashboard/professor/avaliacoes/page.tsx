import { Metadata } from "next";
import AvaliacoesClient from "./avaliacoes-client";

export const metadata: Metadata = {
  title: "Avaliações | SNAE",
  description: "Gerir quizzes e avaliações das disciplinas",
};

export default function AvaliacoesPage() {
  return <AvaliacoesClient />;
}