'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Lightbulb } from 'lucide-react';

interface Hypo3Data {
  r_squared: number;
  f_pvalue: number;
  conclusion: string;
  coefficients: {
    predictor: string[];
    coefficient: number[];
    p_value: number[];
  };
}

export default function Hypothesis3Page() {
  const [data, setData] = useState<Hypo3Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/hypothesis-3')
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-gray-500 italic">Loading Hypothesis 3 data...</p>;
  if (!data) return <p className="text-center text-red-500">No data found.</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Hypothesis 3: Predicting Systolic Blood Pressure
      </h2>

      {/* Goal Card */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
        <Lightbulb className="text-red-600 w-6 h-6 flex-shrink-0 mt-0.5" />
        <p className="text-gray-700">
          Goal: Create a statistically significant linear regression model that predicts
          systolic blood pressure.
        </p>
      </div>

      <p className="mb-6 text-gray-600 leading-relaxed">{data.conclusion}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-lg text-gray-700 font-medium">Model R-squared</p>
          <p className="text-4xl font-extrabold text-indigo-600 mt-2">
            {(data.r_squared * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">
            of blood pressure variance explained
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-lg text-gray-700 font-medium">Model Significance (P-value)</p>
          <p className="text-4xl font-extrabold text-indigo-600 mt-2">
            {data.f_pvalue < 0.001 ? '< 0.001' : data.f_pvalue.toFixed(3)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Indicates model fit quality</p>
        </div>
      </div>

      {/* Coefficients Table */}
      <h3 className="text-lg text-black font-semibold mb-3">Predictor Coefficients</h3>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Predictor</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Coefficient</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">P-value</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Significant?</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {data.coefficients.predictor.map((predictor, index) => (
              <tr
                key={predictor}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-3 px-4 border-b border-gray-200 font-medium">
                  {predictor === 'const' ? 'Intercept' : predictor}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {data.coefficients.coefficient[index].toFixed(3)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {data.coefficients.p_value[index].toExponential(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      data.coefficients.p_value[index] < 0.05
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {data.coefficients.p_value[index] < 0.05 ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}