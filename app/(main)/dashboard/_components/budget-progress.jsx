"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { useCurrency } from "@/components/currency-provider";

export function BudgetProgress({ initialBudget, currentExpenses }) {
  const { formatCurrency, convertAmount } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount ? convertAmount(initialBudget.amount).toString() : ""
  );

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Convert amount back to base currency (USD) before saving
    const baseAmount = convertAmount(amount, true);
    updateBudgetFn(baseAmount);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount ? convertAmount(initialBudget.amount).toString() : "");
    setIsEditing(false);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            Monthly Budget (Default Account)
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32 h-8 text-sm"
                  placeholder="Enter amount"
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                  className="h-7 w-7"
                >
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="h-7 w-7"
                >
                  <X className="h-3.5 w-3.5 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `${formatCurrency(currentExpenses)} of ${formatCurrency(initialBudget.amount)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed}
              extraStyles={`${
                // add to Progress component
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                    ? "bg-yellow-500"
                    : "bg-emerald-600"
                }`}
            />
            <p className="text-xs text-muted-foreground text-right tabular-nums">
              {percentUsed.toFixed(1)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
