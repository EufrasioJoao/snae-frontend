export const formatNivelEnsino = (nivel: string): string => {
  const nivelMap: Record<string, string> = {
    ENSINO_PRIMARIO: "Ensino Primário",
    ENSINO_SECUNDARIO: "Ensino Secundário",
  };
  
  return nivelMap[nivel] || nivel;
};

export const formatRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    ADMIN: "Administrador",
    PROFESSOR: "Professor",
    ESTUDANTE: "Estudante",
    USER: "Utilizador",
  };
  
  return roleMap[role] || role;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric"
  });
};