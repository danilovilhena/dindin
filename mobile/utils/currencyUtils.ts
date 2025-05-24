export function formatCurrency(amount: number): string {
  const absAmount = Math.abs(amount);
  const formattedAmount = absAmount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `R$${formattedAmount}`;
}
