import joblib

def load_model(path):
    return joblib.load(path)

def save_model(model, path):
    joblib.dump(model, path)