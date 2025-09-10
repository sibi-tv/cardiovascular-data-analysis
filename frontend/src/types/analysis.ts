export interface Hypo1Data {
  group_with_disease_avg_bp: number;
  group_without_disease_avg_bp: number;
  conclusion: string;
  p_value: number;
  t_statistic?: number;
  degrees_of_freedom?: number;
  confidence_interval_difference?: [number, number];
  effect_size?: string;
  sample_size_cvd?: number;
  sample_size_no_cvd?: number;
}

export interface Hypo2Data {
  baseline_accuracy: number;
  cv_accuracy_mean: number;
  cv_accuracy_std: number;
  test_accuracy: number;
  accuracy_95_ci: [number, number]; // tuple for confidence interval
  roc_auc: number;
  p_value: number;
  cohens_d: number;
  is_significantly_better: boolean;
  conclusion: string;
  most_important_predictors: {
    name: string;
    coefficient_magnitude: number;
  }[];
}

export interface Hypo3Data {
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