'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb } from 'lucide-react';

interface ClusterAnalysis {
  cluster: number;
  age_years: number;
  weight: number;
  height: number;
  ap_hi: number;
  ap_lo: number;
  bmi: number; 
  disease_percentage: number;
}

interface ClusterData {
    finding: string;
    analysis_by_cluster: ClusterAnalysis[];
}

export default function Hypothesis1Page() {
    const [data, setData] = useState<ClusterData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/k-means-clustering')
            .then(response => setData(response.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-center text-gray-500 italic">Loading Clustering data...</p>;
    if (!data) return <p>No data found.</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-2 text-white">
            Exploration 4: Unsupervised Patient Clustering (K-Means)
          </h2>
          <p className="mb-6 text-gray-300">
            We grouped patients based on their health metrics to find natural profiles. Below, we analyze these profiles and their associated risk of cardiovascular disease.
          </p>

          {/* Goal Card */}
          <div className="bg-gradient-to-r from-yellow-100 via-yellow-50 to-white border-l-4 border-yellow-500 p-4 rounded-lg mb-6 flex items-start shadow-sm">
            <Lightbulb className="h-6 w-6 text-yellow-500 flex-shrink-0 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-700">Goal</h3>
              <p className="text-gray-700">
                To identify distinct patient profiles using K-means clustering and explore how these profiles differ in cardiovascular disease risk.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Disease Risk by Profile */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Disease Risk by Profile</h3>
              <div className="space-y-4">
                {data?.analysis_by_cluster
                  .sort((a, b) => a.disease_percentage - b.disease_percentage)
                  .map((cluster) => (
                    <div key={cluster.cluster}>
                      <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-gray-300">
                          Profile (Cluster {cluster.cluster})
                        </span>
                        <span className="text-sm font-medium text-gray-300">
                          {cluster.disease_percentage.toFixed(1)}% Risk
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full ${
                            cluster.disease_percentage > 86
                              ? 'bg-purple-800'
                              : cluster.disease_percentage > 70
                              ? 'bg-rose-500'
                              : cluster.disease_percentage > 50
                              ? 'bg-orange-500'
                              : cluster.disease_percentage > 30 
                              ? 'bg-yellow-300'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${cluster.disease_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Profile Characteristics */}
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Profile Characteristics (Averages)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead className="bg-gray-200 text-black">
                    <tr>
                      <th className="py-2 px-3 border-b text-left">Profile</th>
                      <th className="py-2 px-3 border-b text-left">Age</th>
                      <th className="py-2 px-3 border-b text-left">Weight</th>
                      <th className="py-2 px-3 border-b text-left">BMI</th>
                      <th className="py-2 px-3 border-b text-left">Systolic BP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.analysis_by_cluster.map((cluster) => (
                      <tr key={cluster.cluster} className="hover:bg-gray-50 text-black">
                        <td className="py-2 px-3 border-b font-bold">Cluster {cluster.cluster}</td>
                        <td className="py-2 px-3 border-b">{cluster.age_years.toFixed(1)}</td>
                        <td className="py-2 px-3 border-b">{cluster.weight.toFixed(1)}</td>
                        <td className="py-2 px-3 border-b">{cluster.bmi.toFixed(1)}</td>
                        <td className="py-2 px-3 border-b">{cluster.ap_hi.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Interpretation Box */}
          <div className="mt-6 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-lg">
            <p>
              <span className="font-bold">Interpretation:</span> The clustering successfully identified a high-risk group. You can now describe the profile of the cluster with the highest disease percentage by looking at its characteristics in the table (e.g., &quot;The highest risk group consists of older patients with higher average weight and blood pressure.&quot;).
            </p>
          </div>
        </div>
    );
}