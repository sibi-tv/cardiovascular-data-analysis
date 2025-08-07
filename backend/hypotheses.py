import pandas as pd
from scipy.stats import ttest_ind

def hypothesis_1(df: pd.DataFrame) -> dict:
    with_disease = df[df['cardio'] == 1]['ap_hi']
    without_disease = df[df['cardio'] == 0]['ap_hi']
    t_stat, p_value = ttest_ind(with_disease, without_disease)
    
    hypothesis_1_result = {
        "group_with_disease_avg_bp": with_disease.mean(),
        "group_without_disease_avg_bp": without_disease.mean(),
        "p_value": p_value,
        "conclusion": "Reject null hypothesis: Systolic BP is significantly higher in patients with CVD." if p_value < 0.05 else "Fail to reject null hypothesis."
    }

    return hypothesis_1_result