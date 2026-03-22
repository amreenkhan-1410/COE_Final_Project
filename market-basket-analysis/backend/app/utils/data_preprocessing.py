import pandas as pd

def preprocess_data(df):
    # Clean data
    # Assume df has columns for transactions
    transactions = df.apply(lambda x: [item for item in x if pd.notna(item)], axis=1).tolist()
    return transactions