import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

export const getHypothesis1 = async () => {
  const { data } = await axios.get(`${API_BASE}/hypothesis-1`);
  return data;
};

export const getHypothesis2 = async () => {
  const { data } = await axios.get(`${API_BASE}/hypothesis-2`);
  return data;
};

export const getHypothesis3 = async () => {
  const { data } = await axios.get(`${API_BASE}/hypothesis-3`);
  return data;
};

export const getClustering = async () => {
  const { data } = await axios.get(`${API_BASE}/k-means-clustering`);
  return data;
};

export const calculateRisk = async (payload: unknown) => {
  const { data } = await axios.post(`${API_BASE}/calculate-risk`, payload);
  return data;
};