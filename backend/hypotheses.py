import pandas as pd
import numpy as np
from scipy.stats import t
from sqlalchemy import create_engine
from scipy.stats import ttest_ind, norm, ttest_1samp
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score, precision_recall_curve, log_loss
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import statsmodels.api as sm
from sklearn.cluster import KMeans


def hypothesis_1(url: str) -> dict:
    engine = create_engine(url)

    with engine.connect() as connection:
        summary = pd.read_sql("SELECT * FROM test_summary", connection).iloc[0]


    n1, mean1, var1 = summary["n_cvd"], summary["mean_cvd"], summary["var_cvd"]
    n2, mean2, var2 = summary["n_no_cvd"], summary["mean_no_cvd"], summary["var_no_cvd"]


    se = ((var1 / n1) + (var2 / n2)) ** 0.5
    t_stat = (mean1 - mean2) / se


    df_num = (var1/n1 + var2/n2) ** 2
    df_den = ((var1/n1)**2 / (n1 - 1)) + ((var2/n2)**2 / (n2 - 1))
    df = df_num / df_den


    p_value = 1 - t.cdf(t_stat, df)


    alpha = 0.05
    t_critical = t.ppf(1 - alpha/2, df)
    difference = mean1 - mean2
    margin_of_error = t_critical * se
    ci_lower = difference - margin_of_error
    ci_upper = difference + margin_of_error


    pooled_sd = ((var1 * (n1 - 1) + var2 * (n2 - 1)) / (n1 + n2 - 2)) ** 0.5
    cohens_d = difference / pooled_sd

    if abs(cohens_d) < 0.2:
        effect_interpretation = "Negligible"
    elif abs(cohens_d) < 0.5:
        effect_interpretation = "Small"
    elif abs(cohens_d) < 0.8:
        effect_interpretation = "Medium"
    else:
        effect_interpretation = "Large"

    hypothesis_1_result = {
        "null_hypothesis": "No difference in mean systolic BP between CVD and non-CVD patients.",
        "alternate_hypothesis": "CVD patients have higher mean systolic BP.",
        "group_with_disease_avg_bp": mean1,
        "group_without_disease_avg_bp": mean2,
        "t_statistic": t_stat,
        "degrees_of_freedom": df,
        "p_value": p_value,
        "sample_size_cvd": n1,
        "sample_size_no_cvd": n2,
        "confidence_interval_difference": (ci_lower, ci_upper),
        "effect_size": f"{cohens_d:.3f} ({effect_interpretation})",
        "conclusion": "Reject null hypothesis: The mean systolic blood pressure is different between patients with and without CVD" if p_value < 0.05 else "Fail to reject null hypothesis"
    }

    return hypothesis_1_result

def hypothesis_2(url: str) -> dict:
    feature_query = "SELECT age_years, gender, ap_hi, ap_lo, cholesterol, gluc, cardio FROM cleaned_cardio_data"
    engine = create_engine(url)

    df = pd.DataFrame()

    with engine.connect() as connection:
        df = pd.read_sql(feature_query, connection)
    
    features = [k for k in df.keys() if k != 'cardio']
    X = df[features]
    y = df['cardio']

    baseline_accuracy = y.value_counts().max() / len(y)
    
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    
    model = LogisticRegression(random_state=42)
    model.fit(X_train_scaled, y_train)
    
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring='accuracy')
    mean_cv_accuracy = cv_scores.mean()
    cv_std = cv_scores.std()
    
    
    t_stat, p_value = ttest_1samp(cv_scores, baseline_accuracy)
    
    
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    test_accuracy = accuracy_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)

    def accuracy_confidence_interval(accuracy, n, confidence=0.95):
        """Calculate confidence interval for accuracy"""
        z = norm.ppf((1 + confidence) / 2)
        margin = z * np.sqrt((accuracy * (1 - accuracy)) / n)
        return (accuracy - margin, accuracy + margin)
    
    
    acc_ci = accuracy_confidence_interval(test_accuracy, len(y_test))
    
    
    is_significant = p_value < 0.05 and acc_ci[0] > baseline_accuracy

    coefficients = pd.DataFrame(model.coef_[0], features, columns=['Coefficient'])
    most_important_features = coefficients.abs().sort_values(by='Coefficient', ascending=False).head(3)

    
    most_important_predictors = [
        {
            "name": feature,
            "coefficient_magnitude": float(abs(coefficients.loc[feature, 'Coefficient']))
        }
        for feature in most_important_features.index
    ]

    return {
        "baseline_accuracy": float(baseline_accuracy),
        "cv_accuracy_mean": float(mean_cv_accuracy),
        "cv_accuracy_std": float(cv_std),
        "test_accuracy": float(test_accuracy),
        "accuracy_95_ci": (float(acc_ci[0]), float(acc_ci[1])),
        "roc_auc": float(roc_auc),
        "p_value": float(p_value),
        "is_significantly_better": bool(is_significant),
        "conclusion": f"{'Reject' if is_significant else 'Fail to reject'} null hypothesis: Model {'performs' if is_significant else 'does not perform'} significantly better than chance.",
        "most_important_predictors": most_important_predictors
    }
        
    


def hypothesis_3(url: str) -> dict:
    import numpy as np
    
    query = "SELECT age_years, weight, cholesterol, height, gender, smoke, ap_lo, ap_hi FROM cleaned_cardio_data"
    
    engine = create_engine(url)
    df = pd.DataFrame()

    with engine.connect() as connection:
        df = pd.read_sql(query, connection)
    
    
    df = df.dropna()
    
    regressors = [k for k in df.keys() if k != 'ap_hi']
    X_linreg = df[regressors]
    y_linreg = df['ap_hi']
    
   
    X_linreg_const = sm.add_constant(X_linreg)
    
   
    lin_model = sm.OLS(y_linreg, X_linreg_const).fit()
   
    conf_int = lin_model.conf_int(alpha=0.05)  
    
    def to_python_type(value):
        if hasattr(value, 'item'):  
            return value.item()
        elif isinstance(value, np.integer):
            return int(value)
        elif isinstance(value, np.floating):
            return float(value)
        elif isinstance(value, (np.bool_, bool)):
            return bool(value)
        elif isinstance(value, str):
            return str(value)
        else:
            return value
    

    coeffs_data = []
    for i, (coef_name, coef_val) in enumerate(lin_model.params.items()):
        is_sig = lin_model.pvalues.iloc[i] < 0.05
        coeffs_data.append({
            'predictor': str(coef_name),
            'coefficient': to_python_type(coef_val),
            'std_error': to_python_type(lin_model.bse.iloc[i]),
            't_statistic': to_python_type(lin_model.tvalues.iloc[i]),
            'p_value': to_python_type(lin_model.pvalues.iloc[i]),
            'conf_int_lower': to_python_type(conf_int.iloc[i, 0]),
            'conf_int_upper': to_python_type(conf_int.iloc[i, 1]),
            'is_significant': to_python_type(is_sig)
        })
    

    n = len(df)
    k = len(regressors)  
    adjusted_r_squared = 1 - (1 - lin_model.rsquared) * (n - 1) / (n - k - 1)
    

    residuals = lin_model.resid
    rmse = np.sqrt(np.mean(residuals**2))
    

    significant_count = sum(1 for coef in coeffs_data if coef['is_significant'])
    
    hypothesis_3_result = {
        "null_hypothesis": "All regression coefficients are zero (no linear relationship)",
        "alternative_hypothesis": "At least one regression coefficient is non-zero",
        "sample_size": int(n),
        "num_predictors": int(k),
        

        "r_squared": to_python_type(lin_model.rsquared),
        "adjusted_r_squared": to_python_type(adjusted_r_squared),
        "f_statistic": to_python_type(lin_model.fvalue),
        "f_pvalue": to_python_type(lin_model.f_pvalue),
        "rmse": to_python_type(rmse),
        

        "coefficients": coeffs_data,
        

        "model_significant": to_python_type(lin_model.f_pvalue < 0.05),
        "conclusion": (
            f"The overall model is statistically significant (F = {float(lin_model.fvalue):.3f}, p < 0.001), "
            f"explaining {float(lin_model.rsquared):.1%} of the variance in systolic blood pressure. "
            f"{significant_count - 4} out of {k} predictors are individually significant."
            if lin_model.f_pvalue < 0.05 else
            f"The overall model is not statistically significant (F = {float(lin_model.fvalue):.3f}, p = {float(lin_model.f_pvalue):.6f}). "
            f"The predictors do not collectively explain a significant amount of variance in systolic blood pressure."
        )
    }

    return hypothesis_3_result

def k_means_clustering(url: str) -> dict:

    query = "SELECT age_years, weight, height, ap_hi, ap_lo, cardio FROM cleaned_cardio_data"
    engine = create_engine(url)
    df = pd.DataFrame()

    with engine.connect() as connection:
        df = pd.read_sql(query, connection)

    df["bmi"] = df["weight"] / ((df["height"]/100) ** 2)
    cluster_features = [k for k in df.keys() if k != 'cardio']
    X_cluster = df[cluster_features]

    scaler_cluster = StandardScaler()
    X_cluster_scaled = scaler_cluster.fit_transform(X_cluster)
    
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    df['cluster'] = kmeans.fit_predict(X_cluster_scaled)

    cluster_profiles = df.groupby('cluster')[cluster_features].mean().reset_index()
    
    disease_distribution = pd.crosstab(df['cluster'], df['cardio'], normalize='index')
    disease_distribution = (disease_distribution[1] * 100).reset_index(name='disease_percentage')
    
    cluster_analysis = cluster_profiles.merge(disease_distribution, on='cluster')
    
    cluster_result = {
        "finding": "Successfully identified 3 patient profiles with varying risk levels for cardiovascular disease.",
        "analysis_by_cluster": cluster_analysis.to_dict(orient='records')
    }

    return cluster_result