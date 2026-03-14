export const formatNivelEnsino = (nivel: string): string => {
  const nivelMap: Record<string, string> = {
    ENSINO_PRIMARIO: "Ensino Primário",
    ENSINO_SECUNDARIO: "Ensino Secundário",
  };
  return nivelMap[nivel] || nivel;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit", 
    year: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getNivelEnsinoColor = (nivel: string): string => {
  const colorMap: Record<string, string> = {
    ENSINO_PRIMARIO: "bg-blue-100 text-blue-800",
    ENSINO_SECUNDARIO: "bg-green-100 text-green-800",
  };
  return colorMap[nivel] || "bg-gray-100 text-gray-800";
};