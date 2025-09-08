"use client";
import { useState } from "react";
import { calculateRisk } from "../../lib/api";
import ResultCard from "../components/cards/ResultCard";
import StatCard from "../components/cards/StatCard";

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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ResultCard title="Risk Calculator">
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm">Age
            <input name="age" type="number" value={form.age} onChange={onChange} className="w-full mt-1 p-2 border rounded"/>
          </label>
          <label className="block text-sm">Systolic BP
            <input name="ap_hi" type="number" value={form.ap_hi} onChange={onChange} className="w-full mt-1 p-2 border rounded"/>
          </label>
          <label className="block text-sm">Cholesterol
            <select name="cholesterol" value={form.cholesterol} onChange={onChange} className="w-full mt-1 p-2 border rounded">
              <option value={1}>Normal</option>
              <option value={2}>Above Normal</option>
              <option value={3}>Well Above Normal</option>
            </select>
          </label>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </form>
      </ResultCard>

      <div className="space-y-4">
        <StatCard title="Risk Score" value={risk === null ? "—" : risk} subtitle="Lower is better" />
        <ResultCard title="Interpretation">
          {risk === null ? (
            <p className="text-slate-600">Enter inputs and click calculate to see the risk score and guidance.</p>
          ) : (
            <p className="text-slate-700">A score of {risk} indicates {risk > 70 ? "High" : risk > 40 ? "Moderate" : "Low"} risk — recommend clinical followup if high.</p>
          )}
        </ResultCard>
      </div>
    </div>
  );
}