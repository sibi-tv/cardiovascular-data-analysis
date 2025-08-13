'use client';
import { useState } from 'react';
import axios from 'axios';

export default function RiskScorePage() {
  const [formData, setFormData] = useState({
    age: 50,
    weight: 70,
    ap_hi: 120,
    cholesterol: 1,
  });
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRiskScore(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/calculate-risk', formData);
      setRiskScore(response.data.risk_score);
    } catch (error) {
      console.error("Failed to calculate risk score", error);
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Calculate Your Risk Score</h1>
      <form onSubmit={handleSubmit}>
        {/* Form Inputs for Age, Weight, Systolic BP, Cholesterol */}
        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700">Age</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="ap_hi" className="block text-gray-700">Systolic Blood Pressure</label>
          <input type="number" name="ap_hi" id="ap_hi" value={formData.ap_hi} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label htmlFor="cholesterol" className="block text-gray-700">Cholesterol Level</label>
          <select name="cholesterol" id="cholesterol" value={formData.cholesterol} onChange={handleChange} className="w-full p-2 border rounded">
            <option value={1}>Normal</option>
            <option value={2}>Above Normal</option>
            <option value={3}>Well Above Normal</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
          {loading ? 'Calculating...' : 'Calculate Score'}
        </button>
      </form>
      
      {riskScore !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-lg text-gray-700">Your Calculated Risk Score Is:</p>
          <p className="text-6xl font-bold text-blue-800">{riskScore}</p>
        </div>
      )}
    </div>
  );
}