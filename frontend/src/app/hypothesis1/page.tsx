"use client";
import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { getHypothesis1 } from "../../lib/api";
import StatCard from "../components/cards/StatCard";
import ResultCard from "../components/cards/ResultCard";
import BarChart from "../components/charts/BarChart";
import { Hypo1Data } from "../../types/analysis";

export default function Hypothesis1Page() {
  const [data, setData] = useState<Hypo1Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis1().then((d) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-slate-500 italic">Loading...</p>;
  if (!data) return <p className="text-center text-red-500">No data.</p>;

  const labels = ["No CVD", "Has CVD"];
  const values = [data.group_without_disease_avg_bp, data.group_with_disease_avg_bp];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Systolic BP (No CVD)"
          value={`${data.group_without_disease_avg_bp.toFixed(1)} mmHg`}
          subtitle="Average among no-CVD group"
        />
        <StatCard
          title="Systolic BP (Has CVD)"
          value={`${data.group_with_disease_avg_bp.toFixed(1)} mmHg`}
          subtitle="Average among CVD group"
          badge={<span className="text-sm font-medium bg-red-100 px-2 py-1 rounded">High</span>}
        />
        <StatCard
          title="P-value"
          value={data.p_value < 0.001 ? "< 0.001" : data.p_value.toFixed(3)}
          subtitle={data.p_value < 0.05 ? "Statistically significant" : "Not significant"}
        />
      </div>

      <ResultCard title="Summary / Conclusion">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
          <p className="text-slate-700">{data.conclusion}</p>
        </div>
      </ResultCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard title="Comparison Chart">
          <div className="h-48">
            <BarChart labels={labels} values={values} />
          </div>
        </ResultCard>

        <ResultCard title="Interpretation">
          <p className="text-slate-600">
            The mean systolic blood pressure is higher in the group with CVD. The low p-value
            indicates this difference is unlikely due to chance.
          </p>
        </ResultCard>
      </div>
    </div>
  );
}