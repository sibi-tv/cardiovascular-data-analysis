import numpy as np
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

username = os.getenv('SUPABASE_USERNAME')
password = os.getenv('SUPABASE_PASSWORD')
host = os.getenv('SUPABASE_HOST')
port = os.getenv('SUPABASE_PORT')
db = os.getenv('SUPABASE_DB')

url = f'postgresql://{username}:{password}@{host}:{port}/{db}'

df = pd.read_csv('cardio_train.csv', sep=';')

def clean_data(data_frame: pd.DataFrame) -> pd.DataFrame:
    data_frame['age_years'] = np.floor(data_frame['age'] / 365)
    data_frame = data_frame[data_frame['ap_hi'] >= data_frame['ap_lo']]
    data_frame = data_frame[(data_frame['ap_hi'] >= 70) & (data_frame['ap_hi'] <= 250)]
    data_frame = data_frame[(data_frame['ap_lo'] >= 40) & (data_frame['ap_lo'] <= 150)]
    
    return data_frame

def upload_to_database(data_frame: pd.DataFrame):
    print(2)
    try:
        print(url)
        engine = create_engine(url)
        data_frame.to_sql('cleaned_cardio_data', engine, if_exists='replace', index=False)
        print("Success")
    except Exception as e:
        print(f"Error: {e}")

df = clean_data(df)
upload_to_database(df)