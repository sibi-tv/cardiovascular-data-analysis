"use client";
import { useEffect, useState } from "react";
import { getHypothesis2 } from "../../lib/api";
import StatCard from "../components/cards/StatCard";
import ResultCard from "../components/cards/ResultCard";
import { Hypo2Data } from "../../types/analysis";

function formatPredictor(p: string) {
  return p.replace(/_/g, " ").replace(/ap/gi, "Blood Pressure").replace(/\b\w/g, c => c.toUpperCase());
}

export default function Hypothesis2Page() {
  const [data, setData] = useState<Hypo2Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis2().then((d) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-slate-500 italic">Loading...</p>;
  if (!data) return <p className="text-center text-red-500">No data.</p>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Model Accuracy" value={`${(data.model_accuracy * 100).toFixed(1)}%`} subtitle="Cross-validated" />
        <ResultCard title="Top Predictors">
          <ul className="space-y-2">
            {data.most_important_predictors.map(p => (
              <li key={p} className="inline-block bg-white px-3 py-1 rounded-full border text-sm shadow-sm">
                {formatPredictor(p)}
              </li>
            ))}
          </ul>
        </ResultCard>
        <ResultCard title="Notes">
          <p className="text-slate-600">Consider feature importance & collinearity; investigate top predictors further.</p>
        </ResultCard>
      </div>

      <ResultCard title="Model Diagnostics">
        <p className="text-slate-600">Add ROC curve, confusion matrix, and calibration plots here (future).</p>
      </ResultCard>
    </div>
  );
}