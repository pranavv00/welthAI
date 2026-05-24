import DashboardPage from "./page";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>
      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-muted animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="h-64 rounded-lg bg-muted animate-pulse" />
              <div className="h-64 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
