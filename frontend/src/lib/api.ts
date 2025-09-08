import axios from "axios";
import { Hypo1Data, Hypo2Data, Hypo3Data, ClusterData } from "../types/analysis";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000/api";

export async function getHypothesis1(): Promise<Hypo1Data> {
  const { data } = await axios.get(`${BASE}/hypothesis-1`);
  return data;
}

export async function getHypothesis2(): Promise<Hypo2Data> {
  const { data } = await axios.get(`${BASE}/hypothesis-2`);
  return data;
}

export async function getHypothesis3(): Promise<Hypo3Data> {
  const { data } = await axios.get(`${BASE}/hypothesis-3`);
  return data;
}

export async function getClustering(): Promise<ClusterData> {
  const { data } = await axios.get(`${BASE}/k-means-clustering`);
  return data;
}

export async function calculateRisk(payload: any) {
  const { data } = await axios.post(`${BASE}/calculate-risk`, payload);
  return data;
}