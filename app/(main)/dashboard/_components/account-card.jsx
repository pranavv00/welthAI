"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/currency-provider";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();
  const { formatCurrency } = useCurrency();

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Prevent card click

    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return; // Don't allow toggling off the default account
    }

    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card 
      className="transition-colors duration-150 hover:bg-muted/40 group relative cursor-pointer"
      onClick={() => router.push(`/account/${id}`)}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">
          {name}
        </CardTitle>
        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
        />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold tabular-nums">
          {formatCurrency(balance)}
        </div>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wide">
          {type.charAt(0) + type.slice(1).toLowerCase()} Account
        </p>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
          Income
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
          Expense
        </div>
      </CardFooter>
    </Card>
  );
}
