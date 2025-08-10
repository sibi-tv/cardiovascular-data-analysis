import os
import pandas as pd
from sqlalchemy import create_engine
from fastapi import FastAPI
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

@app.get("/api/hypothesis-1")
def get_hypo_1():

    hypothesis_1_result = hypothesis_1(url)
    hypothesis_2_result = hypothesis_2(url)
    hypothesis_3_result = hypothesis_3(url)
    cluster_result = k_means_clustering(url)


    return {
        "hypothesis1": hypothesis_1_result, 
        "hypothesis2": hypothesis_2_result,
        "hypothesis3": hypothesis_3_result,
        "cluster_result":cluster_result
    }
