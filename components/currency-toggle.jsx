"use client";

import { useCurrency } from "@/components/currency-provider";
import { updateUserCurrency } from "@/actions/user";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";

const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "INR", label: "INR (₹)" },
  { code: "JPY", label: "JPY (¥)" },
  { code: "AUD", label: "AUD ($)" },
  { code: "CAD", label: "CAD ($)" },
];

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const [isPending, startTransition] = useTransition();

  const handleCurrencyChange = (newCurrency) => {
    // Optimistic update
    setCurrency(newCurrency);
    
    startTransition(async () => {
      const result = await updateUserCurrency(newCurrency);
      if (!result.success) {
        toast.error("Failed to update currency");
      }
    });
  };

  return (
    <Select value={currency} onValueChange={handleCurrencyChange} disabled={isPending}>
      <SelectTrigger className="w-[85px] h-9 bg-transparent border-border/50 text-xs font-medium">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code} className="text-xs">
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
