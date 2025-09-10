"use client";

import { useEffect, useState } from "react";
import { getHypothesis1 } from "@/lib/api";
import StatCard from "@/app/components/cards/StatCard";
import ResultCard from "@/app/components/cards/ResultCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { CheckCircle, XCircle, Activity, TrendingUp, Users, BarChart3, Award } from "lucide-react";

interface Hypothesis1Data {
  group_with_disease_avg_bp: number;
  group_without_disease_avg_bp: number;
  p_value: number;
  conclusion: string;
  // Optional enhanced data
  t_statistic?: number;
  degrees_of_freedom?: number;
  confidence_interval_difference?: [number, number];
  effect_size?: string;
  sample_size_cvd?: number;
  sample_size_no_cvd?: number;
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

function parseEffectSize(effectSizeStr: string): { 
  value: number; 
  interpretation: string; 
  color: "emerald" | "amber" | "red" 
} {
  if (!effectSizeStr) {
    return { value: 0, interpretation: "Unknown", color: "red" };
  }
  
  // Parse "0.543 (Medium)" format
  const match = effectSizeStr.match(/^([\d.-]+)\s*\(([^)]+)\)$/);
  if (!match) {
    return { value: 0, interpretation: "Unknown", color: "red" };
  }
  
  const value = parseFloat(match[1]);
  const interpretation = match[2];
  
  // Map interpretation to colors
  let color: "emerald" | "amber" | "red" = "red";
  if (interpretation.toLowerCase().includes("large")) {
    color = "emerald";
  } else if (interpretation.toLowerCase().includes("medium")) {
    color = "emerald";
  } else if (interpretation.toLowerCase().includes("small")) {
    color = "amber";
  }
  
  return { value, interpretation, color };
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Running T-Test Analysis...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-600 font-semibold text-lg">Failed to load analysis data</p>
      </div>
    );
  }

  const significance = getStatisticalSignificance(data.p_value);
  const meanDifference = data.group_with_disease_avg_bp - data.group_without_disease_avg_bp;
  const effectSize = parseEffectSize(data.effect_size || "");
  const isSignificant = data.p_value < 0.05;

  // Chart data with error bars (you can add standard deviations from backend)
  const chartData = [
    { 
      group: "Without CVD", 
      value: data.group_without_disease_avg_bp,
      fill: "#10b981",
      error: 5 // placeholder - replace with actual std dev from backend
    },
    { 
      group: "With CVD", 
      value: data.group_with_disease_avg_bp,
      fill: "#ef4444",
      error: 5 // placeholder - replace with actual std dev from backend
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-100">
            <Award className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Hypothesis 1: Blood Pressure Comparison
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Two-sample t-test comparing mean systolic blood pressure between patients 
            with and without cardiovascular disease
          </p>
        </div>

        {/* Hypothesis Result Banner */}
        <div className={`rounded-xl border-2 p-6 ${
          isSignificant 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            {isSignificant ? (
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                isSignificant ? 'text-green-800' : 'text-red-800'
              }`}>
                {isSignificant ? 'Hypothesis Supported' : 'Hypothesis Not Supported'}
              </h3>
              <p className={`mt-2 text-lg ${
                isSignificant ? 'text-green-700' : 'text-red-700'
              }`}>
                {data.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Mean Difference"
            value={`${meanDifference.toFixed(1)} mmHg`}
            subtitle="CVD - No CVD"
            color={meanDifference > 0 ? "red" : "emerald"}
            icon={<TrendingUp className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="P-Value"
            value={data.p_value < 0.001 ? "< 0.001" : data.p_value.toFixed(4)}
            subtitle={`${significance.description} ${significance.level}`}
            color={significance.color}
            icon={<BarChart3 className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="Effect Size (Cohen's d)"
            value={effectSize.value ? effectSize.value.toFixed(3) : "N/A"}
            subtitle={effectSize.interpretation}
            color={effectSize.color}
            icon={<Activity className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="T-Statistic"
            value={data.t_statistic ? data.t_statistic.toFixed(3) : "N/A"}
            subtitle={data.degrees_of_freedom ? `df = ${data.degrees_of_freedom}` : "Two-sample test"}
            color={isSignificant ? "emerald" : "red"}
            icon={<Users className="h-6 w-6" />}
            className="shadow-lg"
          />
        </div>

        {/* Statistical Test Details */}
        <ResultCard
          title="Statistical Test Details"
          className="shadow-lg border border-slate-200"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Null Hypothesis (H₀)</h4>
              <p className="text-gray-700 text-sm">
                μ₁ = μ₂ (No difference in mean systolic BP between CVD and non-CVD patients)
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Alternative Hypothesis (H₁)</h4>
              <p className="text-gray-700 text-sm">
                μ₁ ≠ μ₂ (Significant difference in mean systolic BP between groups)
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Test Results</h4>
              <div className="text-sm space-y-1">
                <p className="text-gray-800"><strong>Test:</strong> Two-sample t-test</p>
                <p className="text-gray-800"><strong>α level:</strong> 0.05</p>
                <p className="text-gray-800"><strong>Decision:</strong> {isSignificant ? 'Reject H₀' : 'Fail to reject H₀'}</p>
              </div>
            </div>
          </div>
        </ResultCard>

        {/* Detailed Analysis */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Blood Pressure Comparison Chart */}
          <ResultCard
            title="Mean Systolic Blood Pressure Comparison"
            className="shadow-lg border border-slate-200"
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="40%"
                >
                  <XAxis 
                    dataKey="group" 
                    tick={{ fontSize: 12, fill: '#374151' }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[100, 160]}
                    label={{ 
                      value: 'Systolic BP (mmHg)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#374151' }
                    }}
                    tick={{ fill: '#374151' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)} mmHg`, 'Mean Systolic BP']}
                    contentStyle={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                    labelStyle={{ color: '#4b5563' }} 
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]}
                    barSize={80}
                    label={{
                      position: 'top',
                      fontSize: 12,
                      fill: '#374151',
                      formatter: (label: React.ReactNode) => {
                        if (typeof label === 'number') {
                          return `${label.toFixed(1)} mmHg`;
                        }
                        return '';
                      }
                    }}
                  >
                    {chartData.map((entry, index) => (
                      
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                      
                    ))}
                  </Bar>
                  {/* Reference line for overall mean */}
                  <ReferenceLine 
                    y={(data.group_with_disease_avg_bp + data.group_without_disease_avg_bp) / 2} 
                    stroke="#0000ff" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: "Overall Mean", 
                      position: "insideBottomLeft",
                      fontSize: 11,
                      fill: '#0000ff'
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-800">
                    <strong>Without CVD:</strong> {data.group_without_disease_avg_bp.toFixed(1)} mmHg
                  </p>
                  {data.sample_size_no_cvd && (
                    <p className="text-gray-700">n = {data.sample_size_no_cvd}</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-800">
                    <strong>With CVD:</strong> {data.group_with_disease_avg_bp.toFixed(1)} mmHg
                  </p>
                  {data.sample_size_cvd && (
                    <p className="text-gray-700">n = {data.sample_size_cvd}</p>
                  )}
                </div>
              </div>
            </div>
          </ResultCard>

          {/* Statistical Summary */}
          <ResultCard
            title="Statistical Summary"
            className="shadow-lg border border-slate-200"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">With CVD</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {data.group_with_disease_avg_bp.toFixed(1)}
                  </p>
                  <p className="text-sm text-red-600">mmHg</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Without CVD</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {data.group_without_disease_avg_bp.toFixed(1)}
                  </p>
                  <p className="text-sm text-green-600">mmHg</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Mean Difference:</span>
                  <span className="text-gray-900 font-semibold">
                    {meanDifference.toFixed(2)} mmHg
                  </span>
                </div>
                
                {data.confidence_interval_difference && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">95% CI of Difference:</span>
                    <span className="text-gray-900 font-semibold">
                      [{data.confidence_interval_difference[0].toFixed(2)}, {data.confidence_interval_difference[1].toFixed(2)}]
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">Clinical Significance:</span>
                  <span className={`font-semibold ${
                    Math.abs(meanDifference) >= 5 ? 'text-red-600' : 
                    Math.abs(meanDifference) >= 2 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {Math.abs(meanDifference) >= 5 ? 'Clinically Significant' : 
                    Math.abs(meanDifference) >= 2 ? 'Borderline Significant' : 
                    'Not Clinically Significant'}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Interpretation:</strong> {
                      isSignificant 
                        ? `There is statistically significant evidence (p ${data.p_value < 0.001 ? '< 0.001' : `= ${data.p_value.toFixed(4)}`}) that patients with CVD have ${meanDifference > 0 ? 'higher' : 'lower'} mean systolic blood pressure than those without CVD.`
                        : `There is insufficient statistical evidence (p = ${data.p_value.toFixed(4)}) to conclude that mean systolic blood pressure differs between CVD and non-CVD patients.`
                    }
                  </p>
                </div>
              </div>
            </div>
          </ResultCard>
        </div>
      </div>
    </div>
  );
}