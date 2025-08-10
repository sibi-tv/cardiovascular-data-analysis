'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface ClusterAnalysis {
  cluster: number;
  age_years: number;
  weight: number;
  height: number;
  ap_hi: number;
  ap_lo: number; 
  disease_percentage: number;
}

interface AnalysisData {
  hypothesis1: {
    group_with_disease_avg_bp: number;
    group_without_disease_avg_bp: number;
    p_value: number;
    conclusion: string;
  };
  hypothesis2: {
    model_accuracy: number;
    most_important_predictors: string[];
  };
  hypothesis3: {
    r_squared: number;
    f_pvalue: number;
    conclusion: string;
    coefficients: {
      predictor: string[];
      coefficient: number[];
      p_value: number[];
    };
  };
  cluster_result: {
    finding: string;
    analysis_by_cluster: ClusterAnalysis[];
  };
}

export default function Home() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        console.log("heyyyy")
        const response = await axios.get('http://127.0.0.1:8000/api/hypothesis-1');
        console.log("hiiiiii")
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data from the API. Is the backend server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  if (loading) {
    return <main className="flex min-h-screen flex-col items-center p-24"><p>Loading analysis...</p></main>;
  }

  if (error) {
    return <main className="flex min-h-screen flex-col items-center p-24"><p className="text-red-500">{error}</p></main>;
  }

  if (!data) {
    return null; // Or return a different loading/empty state component
  }

  console.log(data)

  return (
    <main className="flex min-h-screen flex-col items-center p-12 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Cardiovascular Disease Risk Analysis</h1>
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Hypothesis 1: Systolic Blood Pressure Impact</h2>
          <p className="mb-4 text-gray-600">{data?.hypothesis1.conclusion}</p>
          <div className="flex justify-around items-end">
            <div className="text-center">
              <div className="bg-blue-200 w-24 h-32 rounded-t-lg flex items-end justify-center" style={{ height: `${data?.hypothesis1.group_without_disease_avg_bp}px` }}>
                <span className="font-bold text-lg text-blue-800">{data?.hypothesis1.group_without_disease_avg_bp.toFixed(2)}</span>
              </div>
              <p className="mt-2 font-medium">No CVD</p>
            </div>
            <div className="text-center">
              <div className="bg-red-200 w-24 rounded-t-lg flex items-end justify-center" style={{ height: `${data?.hypothesis1.group_with_disease_avg_bp}px` }}>
                <span className="font-bold text-lg text-red-800">{data?.hypothesis1.group_with_disease_avg_bp.toFixed(2)}</span>
              </div>
              <p className="mt-2 font-medium">Has CVD</p>
            </div>
          </div>
          <p className="text-sm text-center mt-4 text-gray-500">P-Value: {data?.hypothesis1.p_value.toExponential(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Hypothesis 2: Predictive Modeling</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg text-gray-600">Model Accuracy:</p>
              <p className="text-5xl font-bold text-green-600">{(data?.hypothesis2.model_accuracy * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-lg text-gray-600">Top 3 Predictors:</p>
              <ul className="list-disc list-inside mt-2">
                {data?.hypothesis2.most_important_predictors.map((predictor) => (
                  <li key={predictor} className="text-gray-700">{predictor.replace('_', ' ').replace('ap', 'Blood Pressure')}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-2">Hypothesis 3: Predicting Systolic Blood Pressure</h2>
          <p className="mb-4 text-gray-600">{data?.hypothesis3.conclusion}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-lg text-gray-600">Model R-squared</p>
              <p className="text-4xl font-bold text-indigo-600">
                {(data?.hypothesis3.r_squared * 100).toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">of blood pressure variance is explained</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-lg text-gray-600">Model Significance (P-value)</p>
              <p className="text-4xl font-bold text-indigo-600">
                {data?.hypothesis3.f_pvalue < 0.001 ? "< 0.001" : data?.hypothesis3.f_pvalue.toFixed(3)}
              </p>
               <p className="text-sm text-gray-500 mt-1">Indicates model is a good fit</p>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Predictor Coefficients</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Predictor</th>
                  <th className="py-2 px-4 border-b text-left">Coefficient</th>
                  <th className="py-2 px-4 border-b text-left">P-value</th>
                  <th className="py-2 px-4 border-b text-left">Significant?</th>
                </tr>
              </thead>
              <tbody>
                {data?.hypothesis3.coefficients.predictor.map((predictor, index) => (
                  <tr key={predictor} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b font-medium">{predictor === 'const' ? 'Intercept' : predictor}</td>
                    <td className="py-2 px-4 border-b">{data.hypothesis3.coefficients.coefficient[index].toFixed(3)}</td>
                    <td className="py-2 px-4 border-b">{data.hypothesis3.coefficients.p_value[index].toExponential(2)}</td>
                    <td className="py-2 px-4 border-b">
                       <span className={`px-2 py-1 rounded-full text-xs font-semibold ${data.hypothesis3.coefficients.p_value[index] < 0.05 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                           {data.hypothesis3.coefficients.p_value[index] < 0.05 ? 'Yes' : 'No'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <h2 className="text-2xl font-semibold mb-2">Exploration 4: Unsupervised Patient Clustering (K-Means)</h2>
          <p className="mb-6 text-gray-600">
            We grouped patients based on their health metrics to find natural profiles. Below, we analyze these profiles and their associated risk of cardiovascular disease.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Disease Risk by Profile</h3>
              <div className="space-y-4">
                {data?.cluster_result.analysis_by_cluster
                  .sort((a, b) => a.disease_percentage - b.disease_percentage) // Sort by risk
                  .map((cluster) => (
                    <div key={cluster.cluster}>
                      <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-gray-700">Profile (Cluster {cluster.cluster})</span>
                        <span className="text-sm font-medium text-gray-700">{cluster.disease_percentage.toFixed(1)}% Risk</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-red-500 h-4 rounded-full"
                          style={{ width: `${cluster.disease_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Profile Characteristics (Averages)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-3 border-b text-left">Profile</th>
                      <th className="py-2 px-3 border-b text-left">Age</th>
                      <th className="py-2 px-3 border-b text-left">Weight</th>
                      <th className="py-2 px-3 border-b text-left">Systolic BP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.cluster_result.analysis_by_cluster.map((cluster) => (
                      <tr key={cluster.cluster} className="hover:bg-gray-50">
                        <td className="py-2 px-3 border-b font-bold">Cluster {cluster.cluster}</td>
                        <td className="py-2 px-3 border-b">{cluster.age_years.toFixed(1)}</td>
                        <td className="py-2 px-3 border-b">{cluster.weight.toFixed(1)}</td>
                        <td className="py-2 px-3 border-b">{cluster.ap_hi.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-800 rounded-r-lg">
            <p><span className="font-bold">Interpretation:</span> The clustering successfully identified a high-risk group. You can now describe the profile of the cluster with the highest disease percentage by looking at its characteristics in the table (e.g., &quot;The highest risk group consists of older patients with higher average weight and blood pressure.&quot;).</p>
          </div>
        </div>
      </div>
    </main>
  );
}