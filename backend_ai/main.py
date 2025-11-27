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

# รูปแบบข้อมูลที่ AI จะส่งมา
class AIInput(BaseModel):
    trashType: str 

# ตัวแปรสำหรับจำค่าล่าสุด (เริ่มมาเป็น None คือยังไม่มีขยะ)
latest_trash_data = {
    "trashType": None,
    "timestamp": None
}

@app.post("/receive-from-ai")
def receive_data(data: AIInput):
    global latest_trash_data
    # บันทึกข้อมูลที่ได้จาก AI
    latest_trash_data["trashType"] = data.trashType
    latest_trash_data["timestamp"] = datetime.now().isoformat()
    print(f"[API Log] Received from AI: {data.trashType}")
    return {"status": "success"}

# --- จุดส่งของ (Web มาขอที่นี่) ---
@app.get("/ai-data")
def serve_data_to_web():
    global latest_trash_data

    # ถ้าไม่มีขยะ หรือขยะเป็น Unknown ให้ส่ง 204 (No Content)
    # หน้าเว็บจะได้รู้ว่า "ยังไม่ต้องเปลี่ยนหน้านะ"
    if latest_trash_data["trashType"] is None or latest_trash_data["trashType"] == "Unknown":
        return Response(status_code=204)

    # ถ้ามีขยะ ส่งข้อมูล JSON กลับไป
    response_data = {
        "trashType": latest_trash_data["trashType"],
        "timestamp": latest_trash_data["timestamp"]
    }
    
    # (Optional) ถ้าอยากให้แสดงผลแค่ครั้งเดียวแล้วเคลียร์ทิ้ง ให้เอาคอมเมนต์บรรทัดล่างออก
    # latest_trash_data["trashType"] = None 

    return response_data

if __name__ == "__main__":
    # รันบน 0.0.0.0 เพื่อให้มั่นใจว่ามองเห็นได้ทั้ง Localhost และ IP จริง
    uvicorn.run(app, host="0.0.0.0", port=PORT)





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

@app.get("/mockup-data/v2")
def mockupData():
    # 70% ของโอกาสจะคืนค่าขยะ, 30% จะคืนค่าว่าง (หรือ Unknown)
    if rn.random() < 0.2:
        # จำลองสถานการณ์ "ไม่มีขยะ" หรือ "ไม่รู้จัก"
        random_trash = {"trashType": "Unknown"} # ต้องแน่ใจว่า Frontend รู้จักค่านี้
    else:
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