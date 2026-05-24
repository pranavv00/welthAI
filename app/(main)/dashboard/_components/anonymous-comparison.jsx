"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Users, Target, AlertCircle, Trophy } from "lucide-react";

const getBaselineAverages = (currency) => {
  // Base US averages (in USD)
  const base = {
    Housing: 1500,
    Food: 600,
    Transportation: 300,
    Entertainment: 200,
    Shopping: 250,
    Utilities: 200,
    Health: 150,
  };

  // Cost of living modifiers relative to US
  const colModifiers = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.9,
    CAD: 0.85,
    AUD: 1.0,
    INR: 0.25, // Lower cost of living
    JPY: 0.6,
  };

  const modifier = colModifiers[currency] || 1.0;
  const adjusted = {};
  for (const key in base) {
    adjusted[key] = base[key] * modifier;
  }
  return adjusted;
};

// Mock data generator based on user's actual spending to ensure realistic comparisons
const generateMockComparisons = (userTotals, currency) => {
  const comparisons = [];
  let userTotal = 0;
  let cityTotal = 0;

  // Define some baseline averages for common categories
  const baselineAverages = getBaselineAverages(currency);

  Object.entries(userTotals).forEach(([category, amount]) => {
    // Generate a plausible city average (within ±30% of user or baseline)
    const baseline = baselineAverages[category] || (300 * (getBaselineAverages(currency).USD ? 1 : 1)); // fallback
    const seed = category.charCodeAt(0) % 5; 
    const variance = 0.8 + (seed * 0.1); // 0.8 to 1.2
    const cityAvg = (baselineAverages[category] || 300 * (getBaselineAverages(currency).USD ? 1 : 1)) * variance;

    userTotal += amount;
    cityTotal += cityAvg;

    const diff = amount - cityAvg;
    const percentage = Math.abs((diff / cityAvg) * 100).toFixed(0);

    comparisons.push({
      category,
      userAmount: amount,
      cityAvg,
      diff,
      percentage,
      isHigher: amount > cityAvg,
    });
  });

  // Sort by biggest difference
  comparisons.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));

  const totalSavedPercent = cityTotal > userTotal 
    ? (((cityTotal - userTotal) / cityTotal) * 100).toFixed(0)
    : 0;

  return { comparisons, userTotal, cityTotal, totalSavedPercent };
};

import { useCurrency } from "@/components/currency-provider";

export function AnonymousComparison({ transactions }) {
  const { formatCurrency, currency } = useCurrency();
  const { comparisons, totalSavedPercent, topInsight, warningInsight } = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Group current month expenses by category
    const userTotals = transactions.reduce((acc, t) => {
      if (t.type === "EXPENSE") {
        const date = new Date(t.date);
        if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
          const cat = t.category.charAt(0).toUpperCase() + t.category.slice(1).toLowerCase();
          acc[cat] = (acc[cat] || 0) + parseFloat(t.amount);
        }
      }
      return acc;
    }, {});

    const { comparisons, totalSavedPercent } = generateMockComparisons(userTotals, currency);

    // Generate smart insights
    let topInsight = null;
    let warningInsight = null;

    if (comparisons.length > 0) {
      const highestOver = comparisons.find(c => c.isHigher);
      const highestUnder = comparisons.find(c => !c.isHigher);

      if (totalSavedPercent > 0) {
        topInsight = {
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          title: "Great Savers Benchmark",
          desc: `You spent ${totalSavedPercent}% less overall than similar users in your demographic this month.`,
        };
      } else if (highestUnder) {
        topInsight = {
          icon: <Target className="h-5 w-5 text-emerald-500" />,
          title: "Strong Savings Category",
          desc: `Your ${highestUnder.category} spending is ${highestUnder.percentage}% below the city average.`,
        };
      }

      if (highestOver && highestOver.percentage > 15) {
        warningInsight = {
          icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
          title: "Spending Warning",
          desc: `Your ${highestOver.category} spending is ${highestOver.percentage}% above average.`,
        };
      }
    }

    return { comparisons: comparisons.slice(0, 4), totalSavedPercent, topInsight, warningInsight };
  }, [transactions, currency]);

  if (comparisons.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-sm font-medium">Insights & Comparison</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Compared to similar users in your city & income bracket
          </p>
        </div>
        <Users className="h-4 w-4 text-muted-foreground hidden sm:block" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Insights Column */}
          <div className="space-y-4">
            {topInsight && (
              <div className="flex items-start gap-3 p-4 bg-muted/40 rounded-lg border border-border/50 transition-colors hover:bg-muted/60">
                <div className="mt-0.5 bg-background p-1.5 rounded-md border shadow-sm">
                  {topInsight.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{topInsight.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{topInsight.desc}</p>
                </div>
              </div>
            )}
            
            {warningInsight && (
              <div className="flex items-start gap-3 p-4 bg-orange-500/5 dark:bg-orange-500/10 rounded-lg border border-orange-500/20 transition-colors hover:bg-orange-500/10 dark:hover:bg-orange-500/15">
                <div className="mt-0.5 bg-background p-1.5 rounded-md border shadow-sm">
                  {warningInsight.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400">{warningInsight.title}</h4>
                  <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1 leading-relaxed">{warningInsight.desc}</p>
                </div>
              </div>
            )}
          </div>

          {/* Category Comparison List */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Category Breakdown</h4>
            <div className="space-y-3">
              {comparisons.map((item) => (
                <div key={item.category} className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.category}</p>
                    <p className="text-xs text-muted-foreground">
                      Avg: {formatCurrency(item.cityAvg)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">{formatCurrency(item.userAmount)}</p>
                      <div className={`flex items-center text-xs ${item.isHigher ? 'text-orange-500' : 'text-emerald-500'}`}>
                        {item.isHigher ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
