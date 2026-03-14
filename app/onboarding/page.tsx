import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import OnboardingClient from "./onboarding-client";
import { PrismaClient } from "@/lib/generated/prisma";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }
  const prisma = new PrismaClient();

  // Buscar dados completos do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Se já completou onboarding, redirecionar para dashboard
  if (user?.finishedOnboarding) {
    redirect("/dashboard");
  }

  return <OnboardingClient user={user as any} />;
}
