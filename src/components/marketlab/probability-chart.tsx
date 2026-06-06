"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ChartSeriesResult } from "@/lib/markets/types";
import { cn } from "@/lib/utils";

type RangeKey = "7d" | "30d" | "all";

type ProbabilityChartProps = {
  series: ChartSeriesResult;
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 240;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };

function filterPointsByRange(
  points: ChartSeriesResult["points"],
  range: RangeKey,
): ChartSeriesResult["points"] {
  if (range === "all" || points.length < 2) {
    return points;
  }

  const days = range === "7d" ? 7 : 30;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const filtered = points.filter(
    (point) => new Date(point.timestamp).getTime() >= cutoff,
  );

  return filtered.length >= 2 ? filtered : points;
}

function formatAxisDate(timestamp: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function buildPath(
  points: ChartSeriesResult["points"],
  xScale: (value: number) => number,
  yScale: (value: number) => number,
): string {
  return points
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${xScale(new Date(point.timestamp).getTime())} ${yScale(point.yesPercent)}`;
    })
    .join(" ");
}

export function ProbabilityChart({ series }: ProbabilityChartProps) {
  const [range, setRange] = useState<RangeKey>("all");

  const visiblePoints = useMemo(
    () => filterPointsByRange(series.points, range),
    [range, series.points],
  );

  const chart = useMemo(() => {
    const timestamps = visiblePoints.map((point) =>
      new Date(point.timestamp).getTime(),
    );
    const minX = Math.min(...timestamps);
    const maxX = Math.max(...timestamps);
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = (value: number) => {
      if (maxX === minX) {
        return PADDING.left + innerWidth / 2;
      }

      return PADDING.left + ((value - minX) / (maxX - minX)) * innerWidth;
    };

    const yScale = (value: number) =>
      PADDING.top + innerHeight - (value / 100) * innerHeight;

    const yTicks = [0, 25, 50, 75, 100];
    const xLabels = [
      visiblePoints[0],
      visiblePoints[Math.floor((visiblePoints.length - 1) / 2)],
      visiblePoints[visiblePoints.length - 1],
    ].filter(Boolean);

    return {
      path: buildPath(visiblePoints, xScale, yScale),
      yTicks: yTicks.map((tick) => ({
        value: tick,
        y: yScale(tick),
      })),
      xLabels: xLabels.map((point) => ({
        label: formatAxisDate(point.timestamp),
        x: xScale(new Date(point.timestamp).getTime()),
      })),
    };
  }, [visiblePoints]);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Yes probability
          </h2>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            {series.currentYesPercent.toFixed(1)}%
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {series.label}
          </p>
        </div>

        <div className="flex gap-2">
          {(["7d", "30d", "all"] as const).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={range === option ? "default" : "outline"}
              onClick={() => setRange(option)}
            >
              {option === "all" ? "All" : option.toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-auto w-full min-w-[320px] text-chart-1"
          role="img"
          aria-label={`Yes probability chart at ${series.currentYesPercent.toFixed(1)} percent`}
        >
          <title>Yes probability chart</title>

          {chart.yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={PADDING.left}
                x2={CHART_WIDTH - PADDING.right}
                y1={tick.y}
                y2={tick.y}
                className="stroke-border"
                strokeDasharray="4 4"
              />
              <text
                x={PADDING.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {tick.value}%
              </text>
            </g>
          ))}

          <path
            d={chart.path}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chart.xLabels.map((label) => (
            <text
              key={`${label.label}-${label.x}`}
              x={label.x}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {label.label}
            </text>
          ))}
        </svg>
      </div>

      <p
        className={cn(
          "mt-3 text-xs text-muted-foreground",
          series.isFlatFallback && "italic",
        )}
      >
        {series.isFlatFallback
          ? "Flat line shows current market balance, not historical movement."
          : "Historical line derived from available trade ledger activity."}
      </p>
    </section>
  );
}
