from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random as rn


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stored_data = []

# function for generate data for mock up case study
@app.get("/mockup-data")
def mockupData():
    data_types = [
        {"trashType": "General"},
        {"trashType": "Paper"},
        {"trashType": "Plastic"},
        {"trashType": "Can"}
    ]
    random_trash = rn.choice(data_types)
    item = {
        "count": len(stored_data) + 1,
        "timestamp": datetime.now().isoformat(),
        **random_trash
    }
    stored_data.append(item)
    return item

@app.get("/history")
def get_history():
    return {"count": len(stored_data),
            "timestamp": datetime.now().isoformat(),
            "data": stored_data}