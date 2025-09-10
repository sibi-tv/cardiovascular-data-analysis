"use client";

import { useEffect, useState } from "react";
import { getHypothesis3 } from "@/lib/api";
import StatCard from "@/app/components/cards/StatCard";
import ResultCard from "@/app/components/cards/ResultCard";
import { CheckCircle, XCircle, TrendingUp, BarChart3, Target, Users } from "lucide-react";

interface Hypo3Data {
  null_hypothesis: string;
  alternative_hypothesis: string;
  sample_size: number;
  num_predictors: number;
  r_squared: number;
  adjusted_r_squared: number;
  f_statistic: number;
  f_pvalue: number;
  rmse: number;
  coefficients: {
    predictor: string;
    coefficient: number;
    std_error: number;
    t_statistic: number;
    p_value: number;
    conf_int_lower: number;
    conf_int_upper: number;
    is_significant: boolean;
  }[];
  model_significant: boolean;
  conclusion: string;
}

function getModelQuality(rSquared: number): { 
  quality: string; 
  color: "emerald" | "amber" | "red" 
} {
  if (rSquared >= 0.7) return { quality: "Strong", color: "emerald" };
  if (rSquared >= 0.3) return { quality: "Moderate", color: "amber" };
  return { quality: "Weak", color: "red" };
}

export default function Hypothesis3Page() {
  const [data, setData] = useState<Hypo3Data | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHypothesis3()
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-indigo-600 font-medium">Running Linear Regression Analysis...</p>
        </div>
      </div>
    );
  }
  console.log(data);
  if (!data) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
        <p className="text-red-600 font-semibold text-lg">Failed to load regression analysis data</p>
      </div>
    );
  }

  const modelQuality = getModelQuality(data.r_squared);
  const significantPredictors = data.coefficients.filter(c => c.is_significant).length - 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-100">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Hypothesis 3: Linear Regression Analysis
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Multiple linear regression predicting systolic blood pressure using age, weight, and cholesterol
          </p>
        </div>

        {/* Model Result Banner */}
        <div className={`rounded-xl border-2 p-6 ${
          data.model_significant 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-4">
            {data.model_significant ? (
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
            )}
            <div>
              <h3 className={`text-xl font-bold ${
                data.model_significant ? 'text-green-800' : 'text-red-800'
              }`}>
                {data.model_significant ? 'Model is Statistically Significant' : 'Model is Not Statistically Significant'}
              </h3>
              <p className={`mt-2 text-lg ${
                data.model_significant ? 'text-green-700' : 'text-red-700'
              }`}>
                {data.conclusion}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="R-squared"
            value={`${(data.r_squared * 100).toFixed(1)}%`}
            subtitle={`${modelQuality.quality} Model Fit`}
            color={modelQuality.color}
            icon={<Target className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="Adjusted R-squared"
            value={`${(data.adjusted_r_squared * 100).toFixed(1)}%`}
            subtitle="Variance Explained"
            color={getModelQuality(data.adjusted_r_squared).color}
            icon={<BarChart3 className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="F-Statistic"
            value={data.f_statistic.toFixed(2)}
            subtitle={`p ${data.f_pvalue < 0.001 ? '< 0.001' : `= ${data.f_pvalue.toFixed(4)}`}`}
            color={data.model_significant ? "emerald" : "red"}
            icon={<BarChart3 className="h-6 w-6" />}
            className="shadow-lg"
          />

          <StatCard
            title="RMSE"
            value={`${data.rmse.toFixed(1)} mmHg`}
            subtitle="Prediction Error"
            color="amber"
            icon={<Users className="h-6 w-6" />}
            className="shadow-lg"
          />
        </div>

        {/* Hypothesis Framework */}
        <ResultCard
          title="Hypothesis Framework"
          className="shadow-lg border border-slate-200"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Null Hypothesis (H₀)</h4>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                {data.null_hypothesis}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Alternative Hypothesis (H₁)</h4>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                {data.alternative_hypothesis}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-purple-600">{data.sample_size.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Sample Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{data.num_predictors}</p>
              <p className="text-sm text-gray-600">Predictors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{significantPredictors}</p>
              <p className="text-sm text-gray-600">Significant</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">0.05</p>
              <p className="text-sm text-gray-600">α Level</p>
            </div>
          </div>
        </ResultCard>

        {/* Coefficients Table */}
        <ResultCard
          title="Regression Coefficients"
          className="shadow-lg border border-slate-200"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100">
                <tr className="text-black text-lg">
                  <th className="py-3 px-4 text-left font-semibold">Predictor</th>
                  <th className="py-3 px-4 text-left font-semibold">Coefficient</th>
                  <th className="py-3 px-4 text-left font-semibold">Std Error</th>
                  <th className="py-3 px-4 text-left font-semibold">t-Statistic</th>
                  <th className="py-3 px-4 text-left font-semibold">P-value</th>
                  <th className="py-3 px-4 text-left font-semibold">95% CI</th>
                  <th className="py-3 px-4 text-left font-semibold">Significant</th>
                </tr>
              </thead>
              <tbody>
                {data.coefficients.map((coef, i) => (
                  <tr key={i} className="odd:bg-white even:bg-slate-50 border-b text-slate-700 border-slate-200">
                    <td className="py-3 px-4 font-medium">
                      {coef.predictor === "const" ? "Intercept" : coef.predictor}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {coef.coefficient.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {coef.std_error.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {coef.t_statistic.toFixed(3)}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {coef.p_value < 0.001 ? "< 0.001" : coef.p_value.toFixed(4)}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-600">
                      [{coef.conf_int_lower.toFixed(2)}, {coef.conf_int_upper.toFixed(2)}]
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        coef.is_significant 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {coef.is_significant ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Coefficient Interpretation
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Coefficient Interpretation:</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {data.coefficients.filter(c => c.predictor !== "const" && c.is_significant).map(coef => (
                <p key={coef.predictor}>
                  <strong>{coef.predictor}:</strong> For every 1-unit increase in {coef.predictor.toLowerCase()}, 
                  systolic BP {coef.coefficient > 0 ? 'increases' : 'decreases'} by {Math.abs(coef.coefficient).toFixed(2)} mmHg 
                  (95% CI: [{coef.conf_int_lower.toFixed(2)}, {coef.conf_int_upper.toFixed(2)}])
                </p>
              ))}
              {data.coefficients.filter(c => c.predictor !== "const" && c.is_significant).length === 0 && (
                <p className="text-gray-600">No individual predictors are statistically significant.</p>
              )}
            </div>
          </div> */}
        </ResultCard>
      </div>
    </div>
  );
}