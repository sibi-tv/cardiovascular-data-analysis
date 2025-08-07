import pandas as pd
from scipy.stats import ttest_ind
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import statsmodels.api as sm

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

def hypothesis_2(df: pd.DataFrame) -> dict:
    features = ['age_years', 'gender', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc']
    X = df[features]
    y = df['cardio']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    model = LogisticRegression()
    model.fit(X_train_scaled, y_train)
    
    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    
    coefficients = pd.DataFrame(model.coef_[0], features, columns=['Coefficient'])
    most_important_features = coefficients.abs().sort_values(by='Coefficient', ascending=False).index.tolist()

    hypothesis_2_result = {
        "model_accuracy": accuracy,
        "most_important_predictors": most_important_features[:3]
    }

    return hypothesis_2_result

def hypothesis_3(df: pd.DataFrame) -> dict:
    X_linreg = df[['age_years', 'weight', 'cholesterol']]
    y_linreg = df['ap_hi']
    
    X_linreg_const = sm.add_constant(X_linreg)
    
    lin_model = sm.OLS(y_linreg, X_linreg_const).fit()
    
    coeffs_data = {
        'predictor': lin_model.params.index.tolist(),
        'coefficient': lin_model.params.values.tolist(),
        'p_value': lin_model.pvalues.values.tolist()
    }
    
    hypothesis_3_result = {
        "r_squared": lin_model.rsquared,
        "f_pvalue": lin_model.f_pvalue,
        "conclusion": "The model is statistically significant in predicting systolic blood pressure." if lin_model.f_pvalue < 0.05 else "The model is not statistically significant.",
        "coefficients": coeffs_data
    }

    return hypothesis_3_result