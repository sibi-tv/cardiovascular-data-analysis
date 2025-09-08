"use client";

import { useEffect, useState } from "react";
import { getHypothesis1 } from "@/lib/api";
import StatCard from "@/app/components/cards/StatCard";
import ChartCard from "@/app/components/charts/ChartCard";

interface Hypothesis1Data {
  group_with_disease_avg_bp: number;
  group_without_disease_avg_bp: number;
  p_value: number;
  conclusion: string;
}

export default function Hypothesis1Page() {
  const [data, setData] = useState<Hypothesis1Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis1()
      .then((res) => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading results…</p>;
  }

  if (!data) {
    return <p className="text-red-500">Failed to load data.</p>;
  }

  // Transform backend response → chart data format
  const chartData = [
    { group: "With Disease", value: data.group_with_disease_avg_bp },
    { group: "Without Disease", value: data.group_without_disease_avg_bp },
  ];

  return (
    <div className="grid gap-6">
      {/* Two-column layout for the first two stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          title="Avg BP (With Disease)"
          value={data.group_with_disease_avg_bp}
          subtitle="Mean systolic blood pressure of patients with CVD"
        />
        <StatCard
          title="Avg BP (Without Disease)"
          value={data.group_without_disease_avg_bp}
          subtitle="Mean systolic blood pressure of patients without CVD"
        />
      </div>

      <StatCard
        title="P-Value"
        value={data.p_value > 0.0001 ? data.p_value : "< 0.0001"}
        subtitle="Statistical significance level"
      />

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Conclusion</h2>
        <p className="text-gray-600">{data.conclusion}</p>
      </div>

      <ChartCard
        title="Average Systolic BP by Group"
        data={chartData}
        dataKey="value"
        xKey="group"
        colors={["#ef4444", "#3b82f6"]}
      />
    </div>
  );
}