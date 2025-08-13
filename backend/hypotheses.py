import pandas as pd
from sqlalchemy import create_engine
from scipy.stats import ttest_ind
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import statsmodels.api as sm
from sklearn.cluster import KMeans

def hypothesis_1(url: str) -> dict:

    engine = create_engine(url)
    optimized_query = "SELECT avg_CVD_patient_systolic, avg_no_CVD_patient_systolic FROM database_summary"
    optimized_subtable_query = "SELECT ap_hi, cardio FROM cleaned_cardio_data"

    averages = []
    systolic_df = pd.DataFrame() 

    with engine.connect() as connection:
        averages = pd.read_sql(optimized_query, connection).iloc[0].to_list()
        systolic_df = pd.read_sql(optimized_subtable_query, connection)

    with_disease = systolic_df[systolic_df['cardio'] == 1]['ap_hi']
    without_disease = systolic_df[systolic_df['cardio'] == 0]['ap_hi']
    t_stat, p_value = ttest_ind(with_disease, without_disease)
    
    hypothesis_1_result = {
        "group_with_disease_avg_bp": averages[0],
        "group_without_disease_avg_bp": averages[1],
        "p_value": p_value,
        "conclusion": "Reject null hypothesis: Systolic BP is significantly higher in patients with CVD." if p_value < 0.05 else "Fail to reject null hypothesis."
    }

    print(p_value)

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

def hypothesis_3(url: str) -> dict:

    query = "SELECT age_years, weight, cholesterol, ap_hi FROM cleaned_cardio_data"
    engine = create_engine(url)
    df = pd.DataFrame()

    with engine.connect() as connection:
        df = pd.read_sql(query, connection)
    
    regressors = [k for k in df.keys() if k != 'ap_hi']

    X_linreg = df[regressors]
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

def k_means_clustering(url: str) -> dict:

    query = "SELECT age_years, weight, height, ap_hi, ap_lo, cardio FROM cleaned_cardio_data"
    engine = create_engine(url)
    df = pd.DataFrame()

    with engine.connect() as connection:
        df = pd.read_sql(query, connection)

    cluster_features = [k for k in df.keys()]
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