import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: number;
  currency?: "DZD" | "EUR" | "USD";
  className?: string;
  decimals?: number;
}

export function CurrencyDisplay({
  amount,
  currency = "DZD",
  className,
  decimals = 2,
}: CurrencyDisplayProps) {
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn("font-mono font-medium", className)}>
      {formatter.format(amount)}
    </span>
  );
}
