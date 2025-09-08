'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb } from 'lucide-react';

interface Hypo1Data {
  group_with_disease_avg_bp: number;
  group_without_disease_avg_bp: number;
  conclusion: string;
  p_value: number;
}

export default function Hypothesis1Page() {
  const [data, setData] = useState<Hypo1Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/hypothesis-1')
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 italic">Loading Hypothesis 1 data...</p>;
  if (!data) return <p className="text-center text-red-500">No data found.</p>;

  const maxBP = Math.max(
    data.group_with_disease_avg_bp,
    data.group_without_disease_avg_bp
  );
  const scaleHeight = (bp: number) => `${(bp / maxBP) * 200}px`;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Hypothesis 1: Systolic Blood Pressure Impact
      </h1>

      {/* Goal Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Lightbulb className="text-blue-600 w-6 h-6 flex-shrink-0 mt-0.5" />
        <p className="text-gray-700">
          Goal: Determine if systolic blood pressure is significantly different between
          people with and without cardiovascular disease (CVD).
        </p>
      </div>

      <p className="mb-6 text-gray-600 leading-relaxed">{data.conclusion}</p>

      <div className="flex justify-around items-end gap-8">
        <div className="text-center group">
          <div
            className="bg-blue-300 w-20 rounded-t-lg flex items-end justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ height: scaleHeight(data.group_without_disease_avg_bp) }}
          >
            <span className="font-bold text-lg text-blue-900 mb-2">
              {data.group_without_disease_avg_bp.toFixed(2)}
            </span>
          </div>
          <p className="mt-2 font-medium text-gray-700">No CVD</p>
        </div>

        <div className="text-center group">
          <div
            className="bg-red-300 w-20 rounded-t-lg flex items-end justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ height: scaleHeight(data.group_with_disease_avg_bp) }}
          >
            <span className="font-bold text-lg text-red-900 mb-2">
              {data.group_with_disease_avg_bp.toFixed(2)}
            </span>
          </div>
          <p className="mt-2 font-medium text-gray-700">Has CVD</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-1 rounded-full shadow-sm">
          P-Value: &lt; 0.001
        </span>
      </div>
    </div>
  );
}