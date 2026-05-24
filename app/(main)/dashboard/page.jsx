import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DashboardOverview } from "./_components/transaction-overview";

import { SpendingHeatmap } from "./_components/spending-heatmap";
import { AnonymousComparison } from "./_components/anonymous-comparison";

export default async function DashboardPage() {
  const [accounts, transactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-6">
      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Spending Heatmap Calendar */}
      <SpendingHeatmap transactions={transactions || []} />

      {/* Anonymous Expense Comparison */}
      <AnonymousComparison transactions={transactions || []} />

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />

      {/* Accounts Grid */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Accounts
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <button className="rounded-xl border bg-card text-card-foreground shadow cursor-pointer border-dashed transition-colors duration-150 hover:border-muted-foreground/40 hover:bg-muted/50 w-full flex flex-col items-center justify-center text-muted-foreground h-[180px]">
              <Plus className="h-8 w-8 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </button>
          </CreateAccountDrawer>
          {accounts.length > 0 &&
            accounts?.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
        </div>
      </div>
    </div>
  );
}
