"use client";

import { Badge } from "@/components/ui/badge";
import { User } from "../_types/user.types";

interface UserStatusBadgeProps {
  user: User;
}

export default function UserStatusBadge({ user }: UserStatusBadgeProps) {
  if (!user.emailVerified) {
    return <Badge variant="outline">Email não verificado</Badge>;
  }
  
  if (!user.finishedOnboarding) {
    return <Badge variant="secondary">Onboarding pendente</Badge>;
  }
  
  return <Badge variant="default">Ativo</Badge>;
}