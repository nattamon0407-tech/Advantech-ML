// api/trashFetch.jsx
// เปลี่ยนจากการเรียก REST API (Polling) เป็นการรอรับข้อมูลจาก DataHub WebSocket

// =================================================================
// ⚙️ 1. CONFIGURATION (กรุณาอัปเดตค่าเหล่านี้)
// =================================================================
// ใส่ URL ของ WebSocket DataHub จริงของคุณ
const DATAHUB_WS_URL = "wss://portal-datahub-datahub-eks008.sa.wise-paas.com"; 
const NODE_ID = "c9fd3832-c358-4ec0-bb49-0e05cdc8b84e"; 
const DEVICE_ID = "Mock_Data_PC"; 
const TAG_NAMES = ["trashType"]; // เราสนใจแค่ trashType

// =================================================================
// 🛠️ 2. HELPER FUNCTIONS
// =================================================================

function createSubscribeMessage() {
    const messageList = TAG_NAMES.map(tagName => ({
        nodeId: NODE_ID,
        deviceId: DEVICE_ID,
        tagName: tagName
    }));

    return {
        topic: "/realdata/convert/req",
        message: messageList
    };
}

function extractTrashType(rawData) {
    // ตรวจสอบว่าข้อมูลที่เข้ามาตรงกับ Format ของ DataHub หรือไม่
    if (rawData.topic === "/realdata/convert/res" && Array.isArray(rawData.message)) {
        const trashTypeItem = rawData.message.find(item => item.tagName === 'trashType');
        if (trashTypeItem && trashTypeItem.value !== undefined) {
            return { trashType: String(trashTypeItem.value) }; // ส่งคืนในรูปแบบ Object { trashType: "..." }
        }
    }
    return null;
}

// =================================================================
// 🚀 3. MAIN FUNCTION (Replacer for original trashFetch)
// =================================================================

/**
 * trashFetch (WebSocket Version)
 * ทำงานเหมือน API Call แต่เบื้องหลังคือการเปิด WebSocket รอรับข้อมูล 1 ครั้งแล้วปิด
 * @returns {Promise<Object | null>} - Promise ที่จะ Resolve เมื่อได้รับข้อมูล trashType
 */
async function trashFetch2() {
    return new Promise((resolve, reject) => {
        console.log("trashFetch: Opening WebSocket connection...");
        let ws = null;
        
        // ตั้ง Timeout 30 วินาที (กันค้างถ้านานเกินไป)
        const timeoutId = setTimeout(() => {
            console.warn("trashFetch: Timeout waiting for DataHub data.");
            cleanup();
            resolve(null); // หรือ reject(new Error("Timeout"))
        }, 30000);

        function cleanup() {
            if (ws) {
                // ส่ง Unsubscribe (Good Practice)
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ "topic":"/realdata/convert/req", "message":[] }));
                    ws.close();
                }
            }
            clearTimeout(timeoutId);
        }

        try {
            ws = new WebSocket(DATAHUB_WS_URL);

            ws.onopen = () => {
                console.log("trashFetch: Connected. Subscribing...");
                const subscribeMessage = createSubscribeMessage();
                ws.send(JSON.stringify(subscribeMessage));
            };

            ws.onmessage = (event) => {
                try {
                    const rawData = JSON.parse(event.data);
                    const result = extractTrashType(rawData);

                    if (result) {
                        console.log("trashFetch: Data received!", result);
                        cleanup(); // ปิดการเชื่อมต่อทันทีที่ได้ข้อมูล
                        resolve(result); // ส่งข้อมูลกลับไปให้หน้าเว็บ (Resolve Promise)
                    }
                } catch (err) {
                    console.error("trashFetch: Error parsing message", err);
                }
            };

            ws.onerror = (error) => {
                console.error("trashFetch: WebSocket Error", error);
                cleanup();
                resolve(null); // ส่ง null กลับไปเมื่อ error
            };

            ws.onclose = () => {
                console.log("trashFetch: Connection closed.");
            };

        } catch (error) {
            console.error("trashFetch: Failed to create WebSocket", error);
            resolve(null);
        }
    });
}

export default trashFetch2;