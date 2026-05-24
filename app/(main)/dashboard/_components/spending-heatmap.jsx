"use client";

import { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrency } from "@/components/currency-provider";

export function SpendingHeatmap({ transactions }) {
  const { formatCurrency } = useCurrency();
  // Process the last 90 days of data
  const { heatmapData, maxAmount, totalSpent } = useMemo(() => {
    const today = startOfDay(new Date());
    const days = 90;
    const dataMap = new Map();

    // Initialize the last 90 days with 0
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, "yyyy-MM-dd");
      dataMap.set(dateStr, {
        date,
        amount: 0,
        categories: {},
        topCategory: null,
      });
    }

    // Process transactions
    transactions.forEach((t) => {
      if (t.type !== "EXPENSE") return;
      const tDate = startOfDay(new Date(t.date));
      const dateStr = format(tDate, "yyyy-MM-dd");

      if (dataMap.has(dateStr)) {
        const dayData = dataMap.get(dateStr);
        dayData.amount += parseFloat(t.amount);
        
        // Track categories
        const cat = t.category || "Other";
        dayData.categories[cat] = (dayData.categories[cat] || 0) + parseFloat(t.amount);
      }
    });

    let max = 0;
    let total = 0;

    // Find top categories and max amount
    const processedData = Array.from(dataMap.values()).map((dayData) => {
      if (dayData.amount > max) max = dayData.amount;
      total += dayData.amount;

      if (Object.keys(dayData.categories).length > 0) {
        dayData.topCategory = Object.entries(dayData.categories).sort(
          (a, b) => b[1] - a[1]
        )[0][0];
      }
      return dayData;
    });

    return { heatmapData: processedData, maxAmount: max, totalSpent: total };
  }, [transactions]);

  // Determine color intensity based on amount
  const getColorClass = (amount) => {
    if (amount === 0) return "bg-muted/30 hover:bg-muted/50 border-border/50";
    
    // Dynamic thresholds
    const ratio = amount / maxAmount;
    
    if (ratio <= 0.25) return "bg-emerald-200 dark:bg-emerald-900/40 hover:bg-emerald-300 dark:hover:bg-emerald-800/60 border-emerald-300/50 dark:border-emerald-800/50";
    if (ratio <= 0.5) return "bg-emerald-400 dark:bg-emerald-700/60 hover:bg-emerald-500 dark:hover:bg-emerald-600/80 border-emerald-500/50 dark:border-emerald-600/50";
    if (ratio <= 0.75) return "bg-orange-400 dark:bg-orange-600/80 hover:bg-orange-500 dark:hover:bg-orange-500 border-orange-500/50 dark:border-orange-500/50";
    return "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500 border-red-600/50 dark:border-red-500/50";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-medium">Spending Activity</CardTitle>
        <div className="text-xs text-muted-foreground">
          Last 90 days
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={50}>
          <div className="flex flex-col space-y-4">
            
            {/* Heatmap Grid */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="flex gap-1.5 min-w-max">
                {/* Organize into columns of 7 days (weeks) */}
                {Array.from({ length: Math.ceil(heatmapData.length / 7) }).map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-1.5">
                    {heatmapData.slice(weekIdx * 7, (weekIdx + 1) * 7).map((day) => (
                      <Tooltip key={format(day.date, "yyyy-MM-dd")}>
                        <TooltipTrigger asChild>
                          <div
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm border transition-colors duration-200 cursor-pointer ${getColorClass(day.amount)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-popover text-popover-foreground border border-border shadow-md rounded-lg p-3"
                          side="top"
                          align="center"
                        >
                          <div className="space-y-1.5">
                            <p className="text-xs font-medium text-muted-foreground">
                              {format(day.date, "MMM d, yyyy")}
                            </p>
                            <p className="text-sm font-semibold">
                              {formatCurrency(day.amount)}
                            </p>
                            {day.topCategory && (
                              <p className="text-xs text-muted-foreground capitalize">
                                Top: <span className="text-foreground font-medium">{day.topCategory}</span>
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend & Summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-muted/30 border border-border/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40 border border-emerald-300/50 dark:border-emerald-800/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700/60 border border-emerald-500/50 dark:border-emerald-600/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-orange-400 dark:bg-orange-600/80 border border-orange-500/50 dark:border-orange-500/50"></div>
                  <div className="w-3 h-3 rounded-sm bg-red-500 dark:bg-red-600 border border-red-600/50 dark:border-red-500/50"></div>
                </div>
                <span>More</span>
              </div>
              <div className="font-medium hidden sm:block">
                90-Day Total: <span className="text-foreground">{formatCurrency(totalSpent)}</span>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
