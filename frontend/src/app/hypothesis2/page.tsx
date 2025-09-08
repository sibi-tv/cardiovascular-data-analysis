"use client";
import { useEffect, useState } from "react";
import { getHypothesis2 } from "../../lib/api";
import StatCard from "../components/cards/StatCard";
import ResultCard from "../components/cards/ResultCard";
import { Hypo2Data } from "../../types/analysis";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

function formatPredictor(p: string) {
  return p
    .replace(/_/g, " ")
    .replace(/ap/gi, "Blood Pressure")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Hypothesis2Page() {
  const [data, setData] = useState<Hypo2Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis2()
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <p className="text-center text-indigo-500 italic animate-pulse">
        Loading...
      </p>
    );
  if (!data)
    return <p className="text-center text-red-500 font-semibold">No data.</p>;

  // Mock ROC curve data (replace with API response if available)
  const rocData = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.6 },
    { fpr: 0.2, tpr: 0.72 },
    { fpr: 0.3, tpr: 0.81 },
    { fpr: 0.4, tpr: 0.87 },
    { fpr: 0.6, tpr: 0.92 },
    { fpr: 0.8, tpr: 0.96 },
    { fpr: 1, tpr: 1 },
  ];

  // Mock predictor importance (replace with API response if available)
  const predictorData = data.most_important_predictors.map((p, idx) => ({
    name: formatPredictor(p),
    importance: (data.most_important_predictors.length - idx) * 10, // dummy scale
  }));

  // Example hypothesis outcome (replace with actual logic)
  const hypothesisText =
    "Hypothesis: Predictor variables can accurately classify outcomes.";
  const hypothesisOutcome =
    data.model_accuracy > 0.7
      ? "Supported — the model achieved strong predictive accuracy."
      : "Rejected — the model did not reach sufficient predictive accuracy.";

  return (
    <div className="space-y-8">
      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Model Accuracy"
          value={`${(data.model_accuracy * 100).toFixed(1)}%`}
          subtitle="Cross-validated"
          className="bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-md"
        />

        <ResultCard
          title="Top Predictors"
          className="shadow-md border border-slate-200"
        >
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={predictorData}
                margin={{ left: 60, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="importance" fill="#6366f1" radius={[4, 4, 4, 4]}>
                  {predictorData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={idx === 0 ? "#4f46e5" : "#6366f1"} // darker for top feature
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ResultCard>

        <ResultCard
          title="Hypothesis Outcome"
          className="shadow-md border border-slate-200"
        >
          <p className="text-slate-700 leading-relaxed">
            <span className="font-semibold text-indigo-700">{hypothesisText}</span>
          </p>
          <p
            className={`mt-2 font-medium ${
              hypothesisOutcome.startsWith("Supported")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {hypothesisOutcome}
          </p>
        </ResultCard>
      </div>

      {/* ROC Curve Section */}
      <ResultCard
        title="Model Diagnostics (ROC Curve)"
        className="shadow-md border border-slate-200"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rocData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                label={{
                  value: "False Positive Rate",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                dataKey="tpr"
                type="number"
                domain={[0, 1]}
                ticks={[0, 0.25, 0.5, 0.75, 1]}
                label={{
                  value: "True Positive Rate",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tpr"
                stroke="#6366f1"
                strokeWidth={3}
                dot={false}
                name="ROC Curve"
              />
              <Line
                type="linear"
                dataKey="fpr"
                stroke="#9ca3af"
                strokeDasharray="5 5"
                dot={false}
                name="Random Guess"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ResultCard>
    </div>
  );
}