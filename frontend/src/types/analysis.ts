export interface Hypo1Data {
  group_with_disease_avg_bp: number;
  group_without_disease_avg_bp: number;
  conclusion: string;
  p_value: number;
}

export interface Hypo2Data {
  model_accuracy: number;
  most_important_predictors: string[];
}

export interface Hypo3Data {
  r_squared: number;
  f_pvalue: number;
  conclusion: string;
  coefficients: {
    predictor: string[];
    coefficient: number[];
    p_value: number[];
  };
}

export interface ClusterAnalysis {
  cluster: number;
  age_years: number;
  weight: number;
  height: number;
  ap_hi: number;
  ap_lo: number;
  bmi: number;
  disease_percentage: number;
}

export interface ClusterData {
  finding: string;
  analysis_by_cluster: ClusterAnalysis[];
}