"use client";
import { useEffect, useState } from "react";
import { getClustering } from "../../lib/api";
import ResultCard from "../components/cards/ResultCard";
import StatCard from "../components/cards/StatCard";
import { ClusterData } from "../../types/analysis";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { Users, TrendingUp, Target, AlertTriangle, BarChart3, Layers } from "lucide-react";

function getColor(p: number): string {
  if (p > 80) return "#6b21a8";
  if (p > 60) return "#ef4444";
  if (p > 40) return "#fb923c";
  if (p > 20) return "#facc15";
  return "#10b981";
}

function getRiskLevel(percentage: number): { level: string; color: "red" | "amber" | "emerald" | "purple" } {
  if (percentage > 80) return { level: "Very High Risk", color: "purple" };
  if (percentage > 60) return { level: "High Risk", color: "red" };
  if (percentage > 40) return { level: "Moderate Risk", color: "amber" };
  return { level: "Low Risk", color: "emerald" };
}

interface ClusterVisualizationData {
  cluster: number;
  disease_percentage: number;
  age_years: number;
  weight: number;
  bmi: number;
  ap_hi: number;
}

interface RadarData {
  subject: string;
  [key: string]: string | number;
}

export default function ClusteringPage() {
  const [data, setData] = useState<ClusterData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getClustering()
      .then((d: ClusterData) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Analyzing Patient Clusters...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-600 font-semibold text-lg">Failed to load clustering data</p>
      </div>
    );

  const sorted = [...data.analysis_by_cluster].sort(
    (a, b) => b.disease_percentage - a.disease_percentage
  );

  const topRiskCluster = sorted[0];
  const lowRiskCluster = sorted[sorted.length - 1];
  const avgRisk = sorted.reduce((acc, c) => acc + c.disease_percentage, 0) / sorted.length;

  // Prepare visualization data
  const visualizationData: ClusterVisualizationData[] = sorted.map(c => ({
    cluster: c.cluster,
    disease_percentage: c.disease_percentage,
    age_years: c.age_years,
    weight: c.weight,
    bmi: c.bmi,
    ap_hi: c.ap_hi
  }));

  // Prepare radar chart data
  const radarData: RadarData[] = [
    { subject: 'Age (years)', ...Object.fromEntries(sorted.map(c => [`Cluster ${c.cluster}`, c.age_years])) },
    { subject: 'Weight (kg)', ...Object.fromEntries(sorted.map(c => [`Cluster ${c.cluster}`, c.weight])) },
    { subject: 'BMI', ...Object.fromEntries(sorted.map(c => [`Cluster ${c.cluster}`, c.bmi])) },
    { subject: 'Systolic BP', ...Object.fromEntries(sorted.map(c => [`Cluster ${c.cluster}`, c.ap_hi])) },
  ];

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-100">
            <Layers className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Risk Profile Clustering Analysis
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Unsupervised clustering reveals distinct patient profiles within this dataset with varying cardiovascular disease risks
            based on demographic and clinical characteristics
          </p>
        </div>

        
        <div className="rounded-3xl p-8 shadow-lg border-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-6">
            <div className="p-4 rounded-2xl bg-blue-100">
              <Target className="h-12 w-12 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3 text-blue-900">
                Key Clinical Finding
              </h3>
              <p className="text-lg leading-relaxed text-blue-800">
                {data.finding}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Patient Profiles"
            value={data.analysis_by_cluster.length.toString()}
            subtitle="Distinct clusters identified"
            color="blue"
            icon={<Users className="h-6 w-6" />}
          />

          <StatCard
            title="Highest Risk Profile"
            value={`Cluster ${topRiskCluster.cluster}`}
            subtitle={`${topRiskCluster.disease_percentage.toFixed(1)}% disease rate`}
            color={getRiskLevel(topRiskCluster.disease_percentage).color}
            icon={<AlertTriangle className="h-6 w-6" />}
          />

          <StatCard
            title="Risk Range"
            value={`${lowRiskCluster.disease_percentage.toFixed(1)}% - ${topRiskCluster.disease_percentage.toFixed(1)}%`}
            subtitle="Min to max disease rates"
            color="amber"
            icon={<TrendingUp className="h-6 w-6" />}
          />

          <StatCard
            title="Average Risk"
            value={`${avgRisk.toFixed(1)}%`}
            subtitle="Across all profiles"
            color="emerald"
            icon={<BarChart3 className="h-6 w-6" />}
          />
        </div>

        {/* Analysis Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Disease Risk by Profile */}
          <ResultCard title="Disease Risk by Patient Profile">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visualizationData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="cluster"
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }}
                    tickLine={false}
                    tickFormatter={(value) => `Cluster ${value}`}
                  />
                  <YAxis
                    domain={[0, 100]}
                    label={{
                      value: 'Disease Rate (%)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#374151', fontWeight: 600 }
                    }}
                    tick={{ fill: '#374151', fontWeight: 500 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Disease Rate']}
                    labelFormatter={(label) => `Cluster ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#4b5563' }}
                  />
                  <Bar
                    dataKey="disease_percentage"
                    radius={[8, 8, 0, 0]}
                    barSize={60}
                  >
                    {visualizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.disease_percentage)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {sorted.slice(0, 3).map((c, index) => {
                const risk = getRiskLevel(c.disease_percentage);
                return (
                  <div key={c.cluster} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: getColor(c.disease_percentage) }}
                      />
                      <span className="font-semibold text-gray-900">Cluster {c.cluster}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        risk.color === 'red' ? 'bg-red-100 text-red-700' :
                        risk.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                        risk.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {risk.level}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">{c.disease_percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </ResultCard>

          {/* Profile Characteristics Radar */}
          <ResultCard title="Profile Characteristics Comparison">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 11, fill: '#374151', fontWeight: 500 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 'dataMax']} 
                    tick={{ fontSize: 10, fill: '#6b7280' }}
                    tickLine={false}
                  />
                  {sorted.slice(0, 3).map((cluster, index) => (
                    <Radar
                      key={`cluster-${cluster.cluster}`}
                      name={`Cluster ${cluster.cluster}`}
                      dataKey={`Cluster ${cluster.cluster}`}
                      stroke={colors[index]}
                      fill={colors[index]}
                      fillOpacity={0.1}
                      strokeWidth={3}
                      dot={{ r: 4, fill: colors[index] }}
                    />
                  ))}
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', fontWeight: '500' }}
                    iconType="line"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-indigo-800 font-medium">
                Radar chart shows normalized clinical characteristics for the top 3 risk clusters
              </p>
            </div>
          </ResultCard>
        </div>

        {/* Detailed Cluster Table */}
        <ResultCard title="Detailed Cluster Analysis">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-100 to-gray-100">
                  <th className="py-4 px-6 text-left font-semibold text-gray-900 rounded-tl-xl">Profile</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-900">Risk Level</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-900">Disease Rate</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-900">Avg Age</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-900">Avg Weight</th>
                  <th className="py-4 px-4 text-left font-semibold text-gray-900">Avg BMI</th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-900 rounded-tr-xl">Systolic BP</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, index) => {
                  const risk = getRiskLevel(c.disease_percentage);
                  return (
                    <tr 
                      key={c.cluster} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getColor(c.disease_percentage) }}
                          />
                          <span className="font-semibold text-gray-900">Cluster {c.cluster}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          risk.color === 'red' ? 'bg-red-100 text-red-700' :
                          risk.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                          risk.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {risk.level}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">{c.disease_percentage.toFixed(1)}%</td>
                      <td className="py-4 px-4 text-gray-700">{c.age_years.toFixed(1)} years</td>
                      <td className="py-4 px-4 text-gray-700">{c.weight.toFixed(1)} kg</td>
                      <td className="py-4 px-4 text-gray-700">{c.bmi.toFixed(1)}</td>
                      <td className="py-4 px-6 text-gray-700">{c.ap_hi.toFixed(1)} mmHg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 font-semibold mb-1">Clinical Insight</p>
              <p className="text-sm text-emerald-700">
                {sorted.length} distinct patient profiles identified with disease rates ranging from{' '}
                {lowRiskCluster.disease_percentage.toFixed(1)}% to {topRiskCluster.disease_percentage.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800 font-semibold mb-1">Risk Stratification</p>
              <p className="text-sm text-blue-700">
                Clustering enables targeted interventions for high-risk profiles while optimizing resources
                for lower-risk patient groups
              </p>
            </div>
          </div>
        </ResultCard>
      </div>
    </div>
  );
}