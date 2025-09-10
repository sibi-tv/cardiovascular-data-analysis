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
import { CheckCircle, XCircle, TrendingUp, BarChart3, Target, Award } from "lucide-react";

function formatPredictor(p: string): string {
  return p
    .replace(/_/g, " ")
    .replace(/hi/gi, "BP")
    .replace(/ap/gi, "Systolic")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
}

function getStatisticalSignificance(pValue: number): { 
  level: string; 
  color: "emerald" | "amber" | "red"; 
  description: string 
} {
  if (pValue < 0.001) return { 
    level: "***", 
    color: "emerald", 
    description: "Highly Significant" 
  };
  if (pValue < 0.01) return { 
    level: "**", 
    color: "emerald", 
    description: "Very Significant" 
  };
  if (pValue < 0.05) return { 
    level: "*", 
    color: "amber", 
    description: "Significant" 
  };
  return { 
    level: "ns", 
    color: "red", 
    description: "Not Significant" 
  };
}

interface PerformanceDataPoint {
  name: string;
  accuracy: number;
  fill: string;
}

interface ROCDataPoint {
  fpr: number;
  tpr: number;
}

export default function Hypothesis2Page() {
  const [data, setData] = useState<Hypo2Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getHypothesis2()
      .then((d: Hypo2Data) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Running Statistical Analysis...</p>
        </div>
      </div>
    );
    
  if (!data)
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-600 font-semibold text-lg">Failed to load analysis data</p>
      </div>
    );

  const significance = getStatisticalSignificance(data.p_value);

  // Create performance comparison data
  const performanceData: PerformanceDataPoint[] = [
    {
      name: "Baseline (Chance)",
      accuracy: data.baseline_accuracy * 100,
      fill: "#64748b",
    },
    {
      name: "Model Performance", 
      accuracy: data.cv_accuracy_mean * 100,
      fill: "#10b981",
    },
  ];

  // ROC curve data - replace with actual ROC data from your API
  const rocData: ROCDataPoint[] = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.35 },
    { fpr: 0.1, tpr: 0.55 },
    { fpr: 0.2, tpr: 0.72 },
    { fpr: 0.3, tpr: 0.82 },
    { fpr: 0.4, tpr: 0.88 },
    { fpr: 0.5, tpr: 0.92 },
    { fpr: 0.7, tpr: 0.96 },
    { fpr: 1, tpr: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-purple-200 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-100">
            <Award className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Hypothesis 2: Predictive Model Analysis (Logistic Regression)
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Statistical evaluation of whether clinical variables (i.e. cholesterol, blood pressure, glucose levels, etc.) can predict cardiovascular disease 
            significantly better than random chance
          </p>
        </div>

        {/* Hypothesis Result Banner */}
        <div className={`rounded-3xl p-8 shadow-lg border-2 ${
          data.is_significantly_better 
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
        }`}>
          <div className="flex items-start gap-6">
            <div className={`p-4 rounded-2xl ${
              data.is_significantly_better ? 'bg-emerald-100' : 'bg-red-100'
            }`}>
              {data.is_significantly_better ? (
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-3 ${
                data.is_significantly_better ? 'text-emerald-900' : 'text-red-900'
              }`}>
                {data.is_significantly_better ? 'Hypothesis Supported ✓' : 'Hypothesis Not Supported ✗'}
              </h3>
              <p className={`text-lg leading-relaxed ${
                data.is_significantly_better ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {data.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Model Accuracy"
            value={`${(data.test_accuracy * 100).toFixed(1)}%`}
            subtitle={`CI: ${(data.accuracy_95_ci[0] * 100).toFixed(1)}% - ${(data.accuracy_95_ci[1] * 100).toFixed(1)}%`}
            color={data.is_significantly_better ? "emerald" : "amber"}
            icon={<Target className="h-6 w-6" />}
          />

          <StatCard
            title="Statistical Significance"
            value={data.p_value < 0.001 ? "< 0.001" : data.p_value.toFixed(4)}
            subtitle={`${significance.description} ${significance.level}`}
            color={significance.color}
            icon={<TrendingUp className="h-6 w-6" />}
          />

          <StatCard
            title="ROC AUC Score"
            value={data.roc_auc.toFixed(3)}
            subtitle="Discrimination Ability"
            color={data.roc_auc > 0.7 ? "emerald" : data.roc_auc > 0.6 ? "amber" : "red"}
            icon={<BarChart3 className="h-6 w-6" />}
          />
        </div>

        {/* Detailed Analysis Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Most Important Predictors */}
          {data.most_important_predictors && data.most_important_predictors.length > 0 && (
            <ResultCard title="Most Important Predictors">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data.most_important_predictors.map((p) => ({
                      name: formatPredictor(p.name),
                      importance: p.coefficient_magnitude,
                    }))}
                    margin={{ right: 40, top: 20, bottom: 20 }}
                    barCategoryGap="25%"
                  >
                    <XAxis type="number" 
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={115}
                      tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [value.toFixed(3), 'Coefficient Magnitude']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ color: '#4b5563' }} 
                    />
                    <Bar 
                      dataKey="importance" 
                      radius={[0, 8, 8, 0]}
                      barSize={28}
                    >
                      {data.most_important_predictors.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#059669' : index === 1 ? '#0891b2' : '#7c3aed'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                <p className="text-sm text-gray-700 font-medium">
                  Rankings based on absolute coefficient values from logistic regression model
                </p>
              </div>
            </ResultCard>
          )}

          {/* Performance Comparison */}
          <ResultCard title="Model vs Baseline Performance">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={performanceData} 
                  margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="35%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                    interval={0}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    label={{ 
                      value: 'Accuracy (%)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#374151', fontWeight: 600 }
                    }}
                    tick={{ fill: '#374151', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Accuracy']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#4b5563' }} 
                  />
                  <Bar 
                    dataKey="accuracy" 
                    radius={[8, 8, 0, 0]}
                    barSize={70}
                    label={{
                      position: 'top',
                      fontSize: 14,
                      fill: '#374151',
                      fontWeight: 600,
                      formatter: (label: React.ReactNode) => {
                        if (typeof label === 'number') {
                          return `${label.toFixed(2)}%`;
                        }
                        return '';
                      }
                    }}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 font-semibold mb-1">
                <strong>Improvement:</strong> {((data.cv_accuracy_mean - data.baseline_accuracy) * 100).toFixed(2)} 
                &nbsp;percentage points above baseline
              </p>
              <p className="text-sm text-emerald-700">
                Cross-validation std: ±{(data.cv_accuracy_std * 100).toFixed(2)}%
              </p>
            </div>
          </ResultCard>

          {/* ROC Curve */}
          <ResultCard title={`ROC Curve (AUC = ${data.roc_auc.toFixed(3)})`}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rocData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#d7dbdf" />
                  <XAxis
                    dataKey="fpr"
                    type="number"
                    domain={[0, 1]}
                    ticks={[0, 0.25, 0.5, 0.75, 1]}
                    tick={{ fill: '#374151', fontWeight: 500 }}
                    tickLine={false}
                    label={{
                      value: "False Positive Rate",
                      position: "insideBottom",
                      offset: -10,
                      style: { textAnchor: 'middle', fill: '#374151', fontWeight: 600 }
                    }}
                  />
                  <YAxis
                    type="number"
                    domain={[0, 1]}
                    ticks={[0, 0.25, 0.5, 0.75, 1]}
                    tick={{ fill: '#374151', fontWeight: 500 }}
                    tickLine={false}
                    label={{
                      value: "True Positive Rate",
                      angle: -90,
                      position: "insideLeft",
                      style: { textAnchor: 'middle', fill: '#374151', fontWeight: 600 }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      value.toFixed(3), 
                      name === 'tpr' ? 'True Positive Rate' : 'False Positive Rate'
                    ]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#4b5563' }} 
                  />
                  <Line
                    type="monotone"
                    dataKey="tpr"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                    name="ROC Curve"
                  />
                  <Line
                    type="linear"
                    dataKey="fpr"
                    stroke="#94a3b8"
                    strokeDasharray="8 8"
                    strokeWidth={2}
                    dot={false}
                    name="Random Classifier"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-semibold">
                AUC interpretation: {
                  data.roc_auc > 0.9 ? "Excellent" :
                  data.roc_auc > 0.8 ? "Good" :
                  data.roc_auc > 0.7 ? "Fair" :
                  data.roc_auc > 0.6 ? "Poor" : "No discrimination"
                } discrimination ability
              </p>
            </div>
          </ResultCard>
        </div>
      </div>
    </div>
  );
}