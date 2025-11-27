import cv2
import time
import serial
from ultralytics import YOLO

# ---------- CONFIG ----------

#path โมเดล
MODEL_PATH = "/home/RecycleX/Models/best.pt"

# ชื่อพอร์ตของ Arduino บน MIC-711ON 
SERIAL_PORT = "/dev/ttyACM0"
BAUD_RATE   = 115200
CONF_THRES = 0.3        # ความมั่นใจขั้นต่ำ
DEVICE     = "cpu"          # ถ้าไม่มี GPU ให้ตั้ง 'cpu'
API_URL = "http://127.0.0.1:8000/receive-from-ai"

# mapping: ชื่อคลาส (ที่เทรนใน YOLO) → ตัวอักษรที่จะส่งไป Arduino
# *** แก้ชื่อ key ให้ตรงกับ class ชั่วใน dataset ของจริง ***
CLASS_TO_CMD = {
    "plastic": "P",   # ใช้ servo มุม
    "paper":   "A",   # ใช้ servo cont. ขา 6
    "can":     "C",   # ใช้ servo cont. ขา 5
    "general": "G"    # ใช้ servo cont. ขา 9
}

# ชื่อสำหรับส่งขึ้น Web (แปลงเป็นตัวพิมพ์ใหญ่ให้ตรงกับ trashMap ของ React)
YOLO_TO_WEB_CLASS = {
    "plastic": "Plastic",
    "paper":   "Paper",
    "can":     "Can",
    "general": "General"
}

# ---------- INITIALIZE ----------
print("[INFO] Loading YOLO model...")
model = YOLO(MODEL_PATH)
names = model.names

print("[INFO] Opening serial port...")
try:
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    time.sleep(2) # รอ Arduino รีเซ็ต
    print("[INFO] Arduino ready.")
except Exception as e:
    print(f"[WARN] Arduino not connected: {e}")
    ser = None

print("[INFO] Opening camera...")
cap = cv2.VideoCapture(0)
# ตั้งค่ากล้องตามความเหมาะสม
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

command_sent = False

print("[INFO] Start detecting... Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("[WARN] Cannot read frame")
        break

    results = model(frame, conf=CONF_THRES, device=DEVICE)
    detected_cmd = None
    detected_class_name = None

    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls_id = int(box.cls[0].item())
            class_name = names[cls_id]
            
            # วาดกรอบ (Optional)
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
            
            if class_name in CLASS_TO_CMD:
                detected_cmd = CLASS_TO_CMD[class_name]
                detected_class_name = class_name
                break # เจอแล้วหยุดหา
        if detected_cmd:
            break

    cv2.imshow("RecycleX Detection", frame)

    # --- จุดที่เจอขยะแล้วส่งข้อมูล ---
    if detected_cmd is not None and not command_sent:
        print(f"[INFO] Found: {detected_class_name}")

        # 1. ส่งเข้า Arduino (ถ้าต่ออยู่)
        if ser:
            ser.write((detected_cmd + "\n").encode("utf-8"))
            ser.flush()
        
        # 2. ส่งเข้า API (เพื่อให้ Web รู้)
        web_trash_type = YOLO_TO_WEB_CLASS.get(detected_class_name, "Unknown")
        payload = {"trashType": web_trash_type}
        
        try:
            print(f"[INFO] Sending to Web API: {payload}")
            requests.post(API_URL, json=payload, timeout=2)
        except Exception as e:
            print(f"[ERROR] API Error: {e}")

        command_sent = True
        
        # หน่วงเวลาหลังเจอขยะ (เช่น 5 วินาที) แล้วค่อยเริ่มหาใหม่
        time.sleep(5) 
        command_sent = False # รีเซ็ตให้หาใหม่ได้ (ถ้าต้องการให้หาต่อทันที)
        # หรือถ้าต้องการจบโปรแกรมเลยให้ใช้ break

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
if ser: ser.close()
print("[INFO] Program ended.")
