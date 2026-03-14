
// Format currency based on the provided currency code
export const formatCurrency = (
  amount: number,
): string => {
  const formatter = new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: 'MZN',
  });
  let formatted = formatter.format(amount);
  
    formatted = formatted.replace(/MTn/gi, "MT");
  
  return formatted;
};

export function FormatAmount(amount: number) {
  return <>{formatCurrency(amount)}</>;
}





/**
 * Formats a date string
 * @param date The date string to format
 * @returns The formatted date string
 */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
