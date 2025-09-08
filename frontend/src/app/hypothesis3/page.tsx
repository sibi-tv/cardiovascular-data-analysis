"use client";
import { useEffect, useState } from "react";
import { getHypothesis3 } from "../../lib/api";
import StatCard from "../components/cards/StatCard";
import ResultCard from "../components/cards/ResultCard";
import { Hypo3Data } from "../../types/analysis";

export default function Hypothesis3Page() {
  const [data, setData] = useState<Hypo3Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis3().then((d) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-slate-500 italic">Loading...</p>;
  if (!data) return <p className="text-center text-red-500">No data.</p>;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard title="R-squared" value={`${(data.r_squared * 100).toFixed(2)}%`} subtitle="Variance explained" />
        <StatCard title="Model P-value" value={data.f_pvalue < 0.001 ? "< 0.001" : data.f_pvalue.toFixed(3)} subtitle="Overall model significance" />
      </div>

      <ResultCard title="Model Conclusion">
        <p className="text-slate-700">{data.conclusion}</p>
      </ResultCard>

      <ResultCard title="Coefficients">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="py-2 px-3 text-left">Predictor</th>
                <th className="py-2 px-3 text-left">Coef</th>
                <th className="py-2 px-3 text-left">P-value</th>
                <th className="py-2 px-3 text-left">Significant</th>
              </tr>
            </thead>
            <tbody>
              {data.coefficients.predictor.map((p, i) => (
                <tr key={p} className="odd:bg-white even:bg-slate-50">
                  <td className="py-2 px-3">{p === "const" ? "Intercept" : p}</td>
                  <td className="py-2 px-3">{data.coefficients.coefficient[i].toFixed(3)}</td>
                  <td className="py-2 px-3">{data.coefficients.p_value[i].toExponential(2)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${data.coefficients.p_value[i] < 0.05 ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"}`}>
                      {data.coefficients.p_value[i] < 0.05 ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultCard>
    </div>
  );
}