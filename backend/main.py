import os
import pandas as pd
from sqlalchemy import create_engine, text
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from hypotheses import hypothesis_1
from hypotheses import hypothesis_2
from hypotheses import hypothesis_3
from hypotheses import k_means_clustering
import json

import json
from datetime import datetime

load_dotenv()

username = os.getenv('SUPABASE_USERNAME')
password = os.getenv('SUPABASE_PASSWORD')
host = os.getenv('SUPABASE_HOST')
port = os.getenv('SUPABASE_PORT')
db = os.getenv('SUPABASE_DB')

url = f'postgresql://{username}:{password}@{host}:{port}/{db}'
engine = create_engine(url)

app = FastAPI()

origins= [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskScoreInput(BaseModel):
    age: int
    ap_hi: int
    cholesterol: int


@app.get("/api/hypothesis-1")
def get_hypo_1():

    hypothesis_1_result = hypothesis_1(url)


    return hypothesis_1_result

@app.get("/api/hypothesis-2")
def get_hypo_2():

    
    hypothesis_2_result = hypothesis_2(url)


    return hypothesis_2_result

@app.get("/api/hypothesis-3")
def get_hypo_3():

    hypothesis_3_result = hypothesis_3(url)


    return hypothesis_3_result

@app.get("/api/k-means-clustering")
def get_hypo_3():

    cluster_result = k_means_clustering(url)


    return cluster_result

@app.post("/api/calculate-risk")
def calculate_risk_score(input_data: RiskScoreInput):
    
    insert_query = f"""INSERT INTO cleaned_cardio_data (id, age_years, ap_hi, cholesterol) 
    VALUES ({100000}, {input_data.age}, {input_data.ap_hi}, {input_data.cholesterol});"""

    max_id_query = "SELECT MAX(id) FROM cleaned_cardio_data"

    risk_score_query = "SELECT get_patient_risk_score(:patient_id)"

    risk_score = 0

    with engine.connect() as connection:
        with connection.begin() as transaction:
            connection.execute(
                text(insert_query)
            )

            patient_id = connection.execute(
                text(max_id_query)
            ).scalar()

            risk_score = connection.execute(
                text(risk_score_query),
                {"patient_id": patient_id}
            ).scalar()

            transaction.rollback()
    
    return {"risk_score": risk_score}
    




