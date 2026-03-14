"use client";

import { Badge } from "@/components/ui/badge";

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const roleConfig = {
    ADMIN: { label: "Admin", variant: "destructive" as const },
    PROFESSOR: { label: "Professor", variant: "default" as const },
    ESTUDANTE: { label: "Estudante", variant: "secondary" as const },
    USER: { label: "Utilizador", variant: "outline" as const },
  };
  
  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
}