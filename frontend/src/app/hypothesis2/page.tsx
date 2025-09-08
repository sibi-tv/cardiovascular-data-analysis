'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb } from 'lucide-react';

interface Hypo2Data {
  model_accuracy: number;
  most_important_predictors: string[];
}

export default function Hypothesis2Page() {
  const [data, setData] = useState<Hypo2Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/hypothesis-2')
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 italic">Loading Hypothesis 2 data...</p>;
  if (!data) return <p className="text-center text-red-500">No data found.</p>;

  const formatPredictor = (p: string) =>
    p
      .replace(/_/g, ' ')
      .replace(/ap/gi, 'Blood Pressure')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Hypothesis 2: Predictive Modeling
      </h2>

      {/* Goal Card */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Lightbulb className="text-yellow-600 w-6 h-6 flex-shrink-0 mt-0.5" />
        <p className="text-gray-700">
          Goal: Determine if the presence of cardiovascular disease (CVD) can be predicted
          based on health-related variables.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="bg-green-50 border border-green-200 rounded-lg px-6 py-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-lg text-gray-700 font-medium">Model Accuracy</p>
          <p className="text-5xl font-extrabold text-green-600 mt-2">
            {(data.model_accuracy * 100).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 w-full shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-lg text-gray-700 font-medium">Top 3 Predictors</p>
          <ul className="mt-3 space-y-2">
            {data.most_important_predictors.map((predictor) => (
              <li
                key={predictor}
                className="text-gray-800 bg-white px-3 py-1 rounded-full border border-gray-200 text-sm shadow-sm"
              >
                {formatPredictor(predictor)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}