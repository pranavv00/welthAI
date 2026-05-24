"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const EXCHANGE_RATES = {
  USD: 1,
  INR: 90, // Static exchange rate as requested
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155.0,
  AUD: 1.5,
  CAD: 1.36,
};

export const CURRENCY_LOCALES = {
  USD: "en-US",
  INR: "en-IN",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  AUD: "en-AU",
  CAD: "en-CA",
};

export function CurrencyProvider({ children, initialCurrency = "USD" }) {
  const [currency, setCurrency] = useState(initialCurrency);

  // Sync state if server prop changes
  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  const convertAmount = (amount, toBase = false) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    if (toBase) return amount / rate;
    return amount * rate;
  };

  const formatCurrency = (amount) => {
    try {
      const convertedAmount = convertAmount(amount);
      return new Intl.NumberFormat(CURRENCY_LOCALES[currency] || "en-US", {
        style: "currency",
        currency: currency,
      }).format(convertedAmount);
    } catch (e) {
      // Fallback if currency code is invalid or not supported
      return `$${Number(amount).toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
