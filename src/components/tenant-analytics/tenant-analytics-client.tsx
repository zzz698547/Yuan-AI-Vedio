"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { AnalyticsCharts } from "@/components/tenant-analytics/analytics-charts";
import { AnalyticsSummaryCards } from "@/components/tenant-analytics/analytics-summary-cards";
import { AnalyticsTables } from "@/components/tenant-analytics/analytics-tables";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSocialAnalytics } from "@/lib/integrations-api";
import type { SocialAnalyticsPayload } from "@/types/social-operations";

export function TenantAnalyticsClient() {
  const [analytics, setAnalytics] = useState<SocialAnalyticsPayload | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  async function loadAnalytics(shouldApply = () => true) {
    setIsLoading(true);
    setError("");

    try {
      const result = await fetchSocialAnalytics();

      if (shouldApply()) {
        setAnalytics(result.data);
      }
    } catch (loadError) {
      if (shouldApply()) {
        setError(
          loadError instanceof Error ? loadError.message : "成效分析資料載入失敗。"
        );
      }
    } finally {
      if (shouldApply()) {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      void loadAnalytics(() => isActive);
    });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            成效分析
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-medium leading-7 text-muted-foreground md:text-base">
            以目前社群綁定與排程資料產生可執行報表；外部平台互動數可在正式
            Analytics API 授權後接入。
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => void loadAnalytics()}
          className="h-10 rounded-xl"
        >
          <RefreshCw data-icon="inline-start" />
          重新整理
        </Button>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </div>
      ) : null}

      {isLoading || !analytics ? (
        <AnalyticsLoading />
      ) : (
        <>
          <AnalyticsSummaryCards stats={analytics.stats} />
          <AnalyticsCharts
            trend={analytics.trend}
            platforms={analytics.platforms}
          />
          <AnalyticsTables
            platforms={analytics.platforms}
            insights={analytics.insights}
          />
        </>
      )}
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="dashboard-card">
          <Skeleton className="h-10 w-10 rounded-2xl" />
          <Skeleton className="mt-4 h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-20" />
        </div>
      ))}
    </div>
  );
}
