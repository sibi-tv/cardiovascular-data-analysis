'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from "next/image";
import { Hammer } from 'lucide-react';

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
    <main className="flex min-h-screen flex-col items-center p-12">
      <h1 className="w-full bg-white p-3 rounded-2xl shadow-md shadow-slate-400 text-4xl font-bold text-center mb-8 text-gray-800">Cardiovascular Disease Risk Analysis</h1>
      <div className="w-full max-w-4xl">
        <Image
          src="/assets/hypo1.png"
          alt="Hypothesis 1 chart"
          width={3000}
          height={200}
          className='p-2 bg-white shadow-2xl'
        />
      </div>
      <div className='flex flex-row items-center justify-center gap-10 mt-10'>
        <Hammer className='text-black' size={150} />
        <div className='flex flex-col gap-5 '>
          <p className='text-black text-4xl flex items-center justify-center'> Website fixes underway, take a look at the preview above!</p>
          <p className='text-black text-xl flex items-center justify-center'> Updates will appear shortly! Stay tuned!</p>
        </div>
      </div>
    </main>
  );
}