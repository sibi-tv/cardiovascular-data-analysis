"use client";
import { useEffect, useState } from "react";
import { getClustering } from "../../lib/api";
import ResultCard from "../components/cards/ResultCard";
import StatCard from "../components/cards/StatCard";
import { ClusterData } from "../../types/analysis";

export default function ClusteringPage() {
  const [data, setData] = useState<ClusterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClustering().then((d)=>setData(d)).finally(()=>setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-slate-500 italic">Loading...</p>;
  if (!data) return <p className="text-center text-red-500">No data.</p>;

  const sorted = [...data.analysis_by_cluster].sort((a,b)=>b.disease_percentage - a.disease_percentage);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Profiles Found" value={data.analysis_by_cluster.length} />
        <StatCard title="Top Risk (cluster)" value={`${sorted[0].cluster} — ${sorted[0].disease_percentage.toFixed(1)}%`} />
        <StatCard title="Key Finding" value={data.finding} subtitle="Overall cluster insight" />
      </div>

      <ResultCard title="Disease Risk by Profile">
        <div className="space-y-4">
          {sorted.map(c => (
            <div key={c.cluster}>
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <div>Profile (Cluster {c.cluster})</div>
                <div>{c.disease_percentage.toFixed(1)}%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className={`h-3 rounded-full`} style={{width: `${c.disease_percentage}%`, background: getColor(c.disease_percentage)}}/>
              </div>
            </div>
          ))}
        </div>
      </ResultCard>

      <ResultCard title="Cluster Averages">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="py-2 px-3 text-left">Cluster</th>
                <th className="py-2 px-3 text-left">Age</th>
                <th className="py-2 px-3 text-left">Weight</th>
                <th className="py-2 px-3 text-left">BMI</th>
                <th className="py-2 px-3 text-left">Systolic BP</th>
              </tr>
            </thead>
            <tbody>
              {data.analysis_by_cluster.map(c => (
                <tr key={c.cluster} className="odd:bg-white even:bg-slate-50">
                  <td className="py-2 px-3 font-medium">Cluster {c.cluster}</td>
                  <td className="py-2 px-3">{c.age_years.toFixed(1)}</td>
                  <td className="py-2 px-3">{c.weight.toFixed(1)}</td>
                  <td className="py-2 px-3">{c.bmi.toFixed(1)}</td>
                  <td className="py-2 px-3">{c.ap_hi.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ResultCard>
    </div>
  );
}

function getColor(p: number){
  if(p>80) return "#6b21a8";
  if(p>60) return "#ef4444";
  if(p>40) return "#fb923c";
  if(p>20) return "#facc15";
  return "#10b981";
}