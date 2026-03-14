import { Metadata } from "next";
import RelatoriosClient from "./relatorios-client";

export const metadata: Metadata = {
  title: "Relatórios | SNAE Admin",
  description: "Analytics e relatórios do sistema SNAE",
};

export default function RelatoriosPage() {
  return <RelatoriosClient />;
}