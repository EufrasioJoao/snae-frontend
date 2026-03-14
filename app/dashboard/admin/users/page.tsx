import { Metadata } from "next";
import UsersClient from "./users-client";

export const metadata: Metadata = {
  title: "Gestão de Utilizadores | SNAE",
  description: "Gerir utilizadores do sistema SNAE",
};

export default function UsersPage() {
  return <UsersClient />;
}