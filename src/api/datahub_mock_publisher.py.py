# datahub_mock_publisher.py
# โค้ด Python สำหรับเชื่อมต่อ DataHub และ Push Mock Data อย่างต่อเนื่อง (Standalone)

import random as rn
import time
from datetime import datetime
import os
import certifi 

# นำเข้า WISE-PaaS Python SDK
# ถ้ายังไม่ได้ติดตั้ง: pip install WISE_PaaS_DataHub_Edge_Python_SDK certifi
from WISE_PaaS_DataHub_Edge_Python_SDK.EdgeAgent import EdgeAgent
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeAgentOptions import EdgeAgentOptions, DCCSOptions
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeConfig import EdgeConfig
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeTag import EdgeTag
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeData import EdgeData
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeDeviceConfig import DeviceConfig
from WISE_PaaS_DataHub_Edge_Python_SDK.Model.EdgeTagConfig import TextTagConfig, AnalogTagConfig
from WISE_PaaS_DataHub_Edge_Python_SDK import constant

# =================================================================
# ⚙️ 1. WISE-PAAS CREDENTIALS (อัปเดตตามรูปภาพที่แนบมา)
# =================================================================
# 💡 Node ID และ Credentials ของคุณ
NODE_ID = "c9fd3832-c358-4ec0-bb49-0e05cdc8b84e"      
CREDENTIAL_KEY = "0d084fe443512ddb7208e5e864ea36ny" 
DCCS_API_URL = "https://api-dccs-ensaas.education.wise-paas.com/" 

DEVICE_ID = "Mock_Data_PC" 
AUTO_PUSH_INTERVAL_SECONDS = 5 # ส่งข้อมูลทุก 5 วินาที

# =================================================================
# 🔗 2. Global State และ Initialization (ประกาศตัวแปร)
# =================================================================
edgeAgent = None
is_config_uploaded = False
current_recycle_count = 0 
TRASH_TYPES = ["General", "Paper", "Plastic", "Can"] 
ROOT_CA_PATH = certifi.where() # ใช้ certifi สำหรับ SSL/TLS

# =================================================================
# 💡 3. ฟังก์ชันสร้างและจัดการ Config
# =================================================================
def create_tag_config():
    # """สร้าง EdgeConfig Object สำหรับ Tag Configuration"""
    config = EdgeConfig()
    deviceConfig = DeviceConfig(id=DEVICE_ID, name="Mock_Data_PC", deviceType="PC")
    
    # Tag 1: trashCount (Analog/Number)
    countTag = AnalogTagConfig(name='trashCount', description='Total items count', readOnly=False, spanHigh=10000, spanLow=0, engineerUnit='items')
    
    # Tag 2: trashType (Text/String)
    typeTag = TextTagConfig(name='trashType', description='Type of trash per item', readOnly=False)
    
    deviceConfig.analogTagList.append(countTag)
    deviceConfig.textTagList.append(typeTag)
    config.node.deviceList.append(deviceConfig)
    return config

def upload_config_if_needed():
    # """ตรวจสอบและ Upload Tag Config เมื่อเชื่อมต่อสำเร็จ"""
    global is_config_uploaded
    if edgeAgent and edgeAgent.isConnected and not is_config_uploaded:
        print("Uploading Tag Configuration...")
        config = create_tag_config()
        result = edgeAgent.uploadConfig(constant.ActionType['Create'], edgeConfig=config)
        if result:
            print("✅ Configuration Uploaded successfully! Tags are now available in DataHub.")
            is_config_uploaded = True
        else:
            print("❌ Configuration Upload Failed.")

# =================================================================
# 🔄 4. ฟังก์ชัน Push Mock Data
# =================================================================
def push_data_once():
    # """สร้างข้อมูลสุ่มและ PUSH เข้า DataHub"""
    global current_recycle_count
    
    if not edgeAgent or not edgeAgent.isConnected:
         print("⚠️ Edge Agent is not connected. Skipping data push.")
         return 

    # 1. Mock Data Generation (สุ่มประเภทขยะและเพิ่ม Counter)
    random_trash_type = rn.choice(TRASH_TYPES)
    current_recycle_count += 1 

    # 2. Create EdgeData Object
    edgeData = EdgeData()
    edgeData.timestamp = datetime.now() 
    
    # 3. Tag สำหรับ Total Count
    tag_count = EdgeTag(
        deviceId = DEVICE_ID,
        tagName = 'trashCount',
        value = current_recycle_count
    )
    
    # 4. Tag สำหรับ Type ล่าสุด
    tag_type = EdgeTag(
        deviceId = DEVICE_ID,
        tagName = 'trashType',
        value = random_trash_type
    )
    
    edgeData.tagList.append(tag_count)
    edgeData.tagList.append(tag_type)

    # 5. Send Data to DataHub
    try:
        result = edgeAgent.sendData(data=edgeData)
        if result:
            print(f"✅ Data Pushed: Timestamp={edgeData.timestamp.strftime('%H:%M:%S')}, Type={random_trash_type}, Count={current_recycle_count}")
        else:
            print("❌ Data Push Failed (SDK returned false).")
    except Exception as e:
        print(f"❌ Error sending data via SDK: {e}")

# =================================================================
# ⚙️ 5. Event Handlers และ Main Loop
# =================================================================
def on_connected(agent, isConnected):
    # """Callback เมื่อเชื่อมต่อ DataHub สำเร็จ"""
    print('✅ SDK Connected successfully!')
    if isConnected:
        upload_config_if_needed()

def on_disconnected(agent, isDisconnected):
    # """Callback เมื่อตัดการเชื่อมต่อ DataHub"""
    print('Disconnected from DataHub. SDK will attempt to reconnect...')

def main():
    # """ฟังก์ชันหลักสำหรับเริ่มต้น Agent และ Push Data Loop"""
    global edgeAgent
    
    options = EdgeAgentOptions(
        reconnectInterval = 10, 
        nodeId = NODE_ID, 
        deviceId = DEVICE_ID, 
        type = constant.EdgeType['Device'], 
        connectType = constant.ConnectType['DCCS'], 
        DCCS = DCCSOptions(APIURL = DCCS_API_URL, credentialKey = CREDENTIAL_KEY),
        # ใช้ certifi เพื่อให้การเชื่อมต่อ SSL/TLS ทำงานอย่างถูกต้อง
        RootCA = ROOT_CA_PATH,
        autoReconnect = True                                   
    )
    
    edgeAgent = EdgeAgent(options=options)
    edgeAgent.on_connected = on_connected
    edgeAgent.on_disconnected = on_disconnected

    print("Starting SDK connection...")
    edgeAgent.connect()
    
    # 💡 เริ่ม Loop เพื่อ Push Data อย่างต่อเนื่อง
    try:
        while True:
            # ตรวจสอบว่าเชื่อมต่อแล้วก่อน Push
            if edgeAgent.isConnected:
                push_data_once()
            else:
                print("Agent is connecting...")
            time.sleep(AUTO_PUSH_INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\nStopping agent and disconnecting...")
    finally:
        if edgeAgent:
            edgeAgent.disconnect()
        print("Publisher stopped.")

if __name__ == "__main__":
    main()