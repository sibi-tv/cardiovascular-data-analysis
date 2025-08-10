
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

username = os.getenv('SUPABASE_USERNAME')
password = os.getenv('SUPABASE_PASSWORD')
host = os.getenv('SUPABASE_HOST')
port = os.getenv('SUPABASE_PORT')
db = os.getenv('SUPABASE_DB')

url = f'postgresql://{username}:{password}@{host}:{port}/{db}'

engine = create_engine(url)

summary_query = """

CREATE VIEW database_summary AS
SELECT
    (SELECT COUNT(*) FROM cleaned_cardio_data WHERE cardio = 1) AS num_CVD_patients,
    (SELECT COUNT(*) FROM cleaned_cardio_data WHERE cardio = 0) AS num_no_CVD_patients,

    (SELECT ROUND(AVG(age_years)) FROM cleaned_cardio_data WHERE cardio = 1) AS avg_CVD_patient_age,
    (SELECT AVG(weight) FROM cleaned_cardio_data WHERE cardio = 1) AS avg_CVD_patient_weight,
    (SELECT AVG(height) FROM cleaned_cardio_data WHERE cardio = 1) AS avg_CVD_patient_height,
    (SELECT ROUND(AVG(ap_hi)) FROM cleaned_cardio_data WHERE cardio = 1) AS avg_CVD_patient_systolic,
    (SELECT ROUND(AVG(ap_lo)) FROM cleaned_cardio_data WHERE cardio = 1) AS avg_CVD_patient_diastolic,

    (SELECT ROUND(AVG(age_years)) FROM cleaned_cardio_data WHERE cardio = 0) AS avg_no_CVD_patient_age,
    (SELECT AVG(weight) FROM cleaned_cardio_data WHERE cardio = 0) AS avg_no_CVD_patient_weight,
    (SELECT AVG(height) FROM cleaned_cardio_data WHERE cardio = 0) AS avg_no_CVD_patient_height,
    (SELECT ROUND(AVG(ap_hi)) FROM cleaned_cardio_data WHERE cardio = 0) AS avg_no_CVD_patient_systolic,
    (SELECT ROUND(AVG(ap_lo)) FROM cleaned_cardio_data WHERE cardio = 0) AS avg_no_CVD_patient_diastolic;

"""

calculate_risk_score = """

CREATE OR REPLACE FUNCTION get_patient_risk_score(patient_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    score INT := 0;
    patient_age INT;
    patient_ap_hi INT;
    patient_cholesterol INT;
BEGIN
    SELECT age_years, ap_hi, cholesterol
    INTO patient_age, patient_ap_hi, patient_cholesterol
    FROM cardio_data_cleaned
    WHERE id = patient_id;

    IF patient_age > 55 THEN score := score + 1; END IF;
    IF patient_age > 65 THEN score := score + 1; END IF;

    IF patient_ap_hi > 140 THEN score := score + 1; END IF;
    IF patient_ap_hi > 160 THEN score := score + 1; END IF;

    IF patient_cholesterol = 2 THEN score := score + 1;
    ELSIF patient_cholesterol = 3 THEN score := score + 2;
    END IF;

    RETURN score;
END;
$$;

"""

def run_queries():
    with engine.connect() as connection:
        connection.execute(text(summary_query))
        connection.execute(text(calculate_risk_score))
        connection.commit()

run_queries()