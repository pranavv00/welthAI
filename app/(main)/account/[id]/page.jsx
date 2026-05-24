import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { CURRENCY_LOCALES, EXCHANGE_RATES } from "@/components/currency-provider";

export default async function AccountPage({ params }) {
  const { id } = await params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  const userCurrency = account.user.currency || "USD";
  const rate = EXCHANGE_RATES[userCurrency] || 1;
  const convertedBalance = account.balance * rate;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight capitalize pb-2">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold tabular-nums">
            {new Intl.NumberFormat(CURRENCY_LOCALES[userCurrency] || "en-US", {
              style: "currency",
              currency: userCurrency,
            }).format(convertedBalance)}
          </div>
          <p className="text-xs text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={
          <div className="h-96 rounded-lg bg-muted animate-pulse" />
        }
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={
          <div className="h-64 rounded-lg bg-muted animate-pulse" />
        }
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
