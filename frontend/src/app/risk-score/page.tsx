"use client";
import { useState } from "react";
import { calculateRisk } from "../../lib/api";
import ResultCard from "../components/cards/ResultCard";
import StatCard from "../components/cards/StatCard";
import { Heart, Calculator, AlertTriangle, CheckCircle, Activity } from "lucide-react";

function getRiskLevel(score: number): {
  level: string;
  color: "emerald" | "amber" | "red";
  icon: React.ReactNode;
  description: string;
} {
  if (score == 5) {
    return {
      level: "High Risk",
      color: "red",
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Recommend immediate clinical follow-up and lifestyle interventions"
    };
  }
  if (score == 4) {
    return {
      level: "Moderate-High Risk",
      color: "red", 
      icon: <Activity className="h-5 w-5" />,
      description: "Consider preventive measures and regular monitoring"
    };
  }
  if (score == 3) {
    return {
      level: "Moderate Risk",
      color: "amber", 
      icon: <Activity className="h-5 w-5" />,
      description: "Consider preventive measures and regular monitoring"
    };
  }
  if (score == 2) {
    return {
      level: "Low-Moderate Risk",
      color: "amber", 
      icon: <Activity className="h-5 w-5" />,
      description: "Consider preventive measures and regular monitoring"
    };
  }
  return {
    level: "Low Risk",
    color: "emerald",
    icon: <CheckCircle className="h-5 w-5" />,
    description: "Continue healthy lifestyle habits and routine check-ups"
  };
}

export default function RiskScorePage() {
  const [form, setForm] = useState({ age: 50, weight: 70, ap_hi: 120, cholesterol: 1 });
  const [risk, setRisk] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setRisk(null);
    try {
      const res = await calculateRisk(form);
      setRisk(res.risk_score ?? null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const riskData = risk !== null ? getRiskLevel(risk) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-purple-200 p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-md border border-gray-100">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Cardiovascular Risk Calculator
            </h1>
          </div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Calculate personalized cardiovascular risk score based on age, blood pressure, and cholesterol levels
          </p>
        </div>

        {/* Risk Result Banner */}
        {riskData && (
          <div className={`rounded-xl border-2 p-6 ${
            riskData.color === "emerald" ? 'bg-green-50 border-green-200' :
            riskData.color === "amber" ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${
                riskData.color === "emerald" ? 'bg-green-100 text-green-600' :
                riskData.color === "amber" ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {riskData.icon}
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  riskData.color === "emerald" ? 'text-green-800' :
                  riskData.color === "amber" ? 'text-yellow-800' :
                  'text-red-800'
                }`}>
                  {riskData.level}
                </h3>
                <p className={`mt-2 text-lg ${
                  riskData.color === "emerald" ? 'text-green-700' :
                  riskData.color === "amber" ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {riskData.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <ResultCard
            title="Patient Information"
            className="shadow-lg border border-slate-200"
          >
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Age (years)
                  </label>
                  <input
                    name="age"
                    type="number"
                    min="18"
                    max="120"
                    value={form.age}
                    onChange={onChange}
                    className="w-full p-3 border text-slate-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter age"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Weight (kg)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    min="30"
                    max="300"
                    value={form.weight}
                    onChange={onChange}
                    className="w-full p-3 border text-slate-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter weight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Systolic Blood Pressure (mmHg)
                </label>
                <input
                  name="ap_hi"
                  type="number"
                  min="80"
                  max="250"
                  value={form.ap_hi}
                  onChange={onChange}
                  className="w-full p-3 border text-slate-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter systolic BP"
                />
                <p className="text-xs text-gray-500">Normal range: 90-120 mmHg</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Cholesterol Level
                </label>
                <select
                  name="cholesterol"
                  value={form.cholesterol}
                  onChange={onChange}
                  className="w-full p-3 border text-slate-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value={1}>Normal (&lt; 200 mg/dL)</option>
                  <option value={2}>Above Normal (200-239 mg/dL)</option>
                  <option value={3}>Well Above Normal (≥ 240 mg/dL)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5" />
                    Calculate Risk Score
                  </>
                )}
              </button>
            </form>
          </ResultCard>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Risk Score Card */}
            <StatCard
              title="Risk Score"
              value={risk === null ? "—" : risk.toString()}
              subtitle={risk === null ? "Enter data and calculate" : `${riskData?.level}`}
              color={risk === null ? "amber" : riskData?.color || "amber"}
              icon={<Heart className="h-6 w-6" />}
              className="shadow-lg"
            />

            {/* Current Values Display */}
            <ResultCard
              title="Current Input Values"
              className="shadow-lg border border-slate-200"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Age:</span>
                  <span className="text-slate-500 font-semibold">{form.age} years</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-slate-500 font-semibold">{form.weight} kg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Systolic BP:</span>
                  <span className="text-slate-500 font-semibold">{form.ap_hi} mmHg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Cholesterol:</span>
                  <span className="text-slate-500 font-semibold">
                    {form.cholesterol === 1 ? "Normal" : 
                     form.cholesterol === 2 ? "Above Normal" : "Well Above Normal"}
                  </span>
                </div>
              </div>
            </ResultCard>

            {/* Interpretation Card */}
            <ResultCard
              title="Risk Assessment"
              className="shadow-lg border border-slate-200"
            >
              {risk === null ? (
                <div className="text-center py-8">
                  <Calculator className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">
                    Enter your information and click calculate to see your personalized risk assessment
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      riskData?.color === "emerald" ? 'bg-green-100 text-green-600' :
                      riskData?.color === "amber" ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {riskData?.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Your risk score is {risk}
                      </p>
                      <p className="text-sm text-gray-600">
                        {riskData?.description}
                      </p>
                    </div>
                  </div>

                  {/* Risk Scale Visual */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Risk Scale:</p>
                    <div className="flex h-6 rounded-full overflow-hidden bg-gray-200">
                      <div className="bg-green-400 flex-1 flex items-center justify-center text-white text-xs font-semibold">1</div>
                      <div className="bg-yellow-300 flex-1 flex items-center justify-center text-gray-700 text-xs font-semibold">2</div>
                      <div className="bg-yellow-500 flex-1 flex items-center justify-center text-white text-xs font-semibold">3</div>
                      <div className="bg-red-400 flex-1 flex items-center justify-center text-white text-xs font-semibold">4</div>
                      <div className="bg-red-600 flex-1 flex items-center justify-center text-white text-xs font-semibold">5</div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low Risk</span>
                      <span>Low-Moderate</span>
                      <span>Moderate</span>
                      <span>Moderate-High</span>
                      <span>High Risk</span>
                    </div>
                    {risk !== null && (
                      <div 
                        className="relative flex justify-center"
                        style={{ 
                          marginLeft: `${((risk - 0.5) / 5) * 100}%`,
                          marginRight: `${((5.5 - risk) / 5) * 100}%`
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                          <div className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
                            {risk}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ResultCard>
          </div>
        </div>
      </div>
    </div>
  );
}