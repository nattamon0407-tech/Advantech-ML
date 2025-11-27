import { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import imgUnknown from '/Unknown.svg';
import trashMap from "./utils/trashMap.jsx"; // *สำคัญ* ต้องมีไฟล์นี้เพื่อแปลง data
import './trash_main.module.css';

const DEFAULT_DATA = {
    type: 'ไม่ทราบประเภท',
    image: imgUnknown,
    point: 0,
    category: "Unknown",
    color: '#808080'
};

function TrashDisplay2({ onNavigateReady, externalData }) {
    const location = useLocation();
    const [data, setData] = useState(DEFAULT_DATA);
    const [totalPoint, setTotalPoint] = useState(0);
    const [countdown, setCountdown] = useState(10);

    // ฟังก์ชันกลางสำหรับอัปเดตข้อมูลขยะ (ใช้ร่วมกันทั้งจาก Welcome และ Trigger)
    const updateTrashData = useCallback((apiData) => {
        if (!apiData || !apiData.trashType) return;

        // แปลงข้อมูลดิบจาก API ให้เป็นรูปแบบที่หน้าจอต้องการ
        // โดยใช้ trashMap (ถ้าคุณยังไม่มีไฟล์นี้ แจ้งได้นะครับ เดี๋ยวช่วยเขียนให้)
        const mappedData = trashMap(apiData.trashType);

        if (mappedData) {
            console.log("Updating Display with:", mappedData);
            setData(mappedData);
            setTotalPoint(prev => prev + mappedData.point);
            setCountdown(10); // รีเซ็ตเวลานับถอยหลังบนหน้าจอ
        }
    }, []);

    // 1. รับข้อมูลชิ้นแรกจาก WelcomePage (ทำงานครั้งเดียวตอนโหลดหน้า)
    useEffect(() => {
        if (location.state?.initialData) {
            console.log("Received Initial Data form WelcomePage");
            updateTrashData(location.state.initialData);
        }
    }, [location.state, updateTrashData]);

    // 2. รับข้อมูลชิ้นถัดๆ ไปจาก TrashTrigger2 (ทำงานเมื่อ externalData เปลี่ยน)
    useEffect(() => {
        if (externalData) {
            console.log("Received New Data form Trigger");
            updateTrashData(externalData);
        }
    }, [externalData, updateTrashData]);

    // 3. ส่งคะแนนรวมกลับไปให้ตัวแม่ (TrashTrigger2) เพื่อเตรียมส่งไปหน้า Summary
    useEffect(() => {
        if (onNavigateReady) {
            onNavigateReady({ 
                totalPoint: totalPoint,
            });
        }
    }, [totalPoint, onNavigateReady]);

    // 4. ตัวนับถอยหลัง (Visual Only) - เพื่อความสวยงามให้ User รู้ว่าใกล้หมดเวลา
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prevCount => {
                if (prevCount <= 0) return 0;
                return prevCount - 1;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop : "20px"}}>
          
          {/* ส่วนแสดงผลหลัก */}
          <img src={data.image} alt={data.type} width={"300"} />
          <h2>{data.type}</h2>
          <p>{data.category}</p>
          
          <p style={{fontSize : '70px'}}> + {data.point} Points</p> 
          
          <p style={{marginTop: '1px', backgroundColor: data.color, color: 'white', padding: '10px', borderRadius: '60px', fontSize: "30px", paddingLeft:"20px", paddingRight:"20px"}}>
            Total {totalPoint} Points
          </p>
          
          <p style={{marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold', paddingLeft:"150px", paddingRight:"150px"}}>
            Time Remaining: {countdown} seconds
          </p>

          {/* รูปตกแต่งมุมจอ */}
          <div style={{display: 'flex', alignItems: 'center', marginTop:'20px'}}>
            <img src="./21.png" alt="decor-left" style={{
                 position: 'fixed',
                 bottom: '50px',
                 left: '20px',
                 width: '100px',
                 zIndex: 1000}}/>
            <img src="./22.png" alt="decor-right" style={{ 
                 position: 'fixed',
                 bottom: '50px',
                 right: '20px',
                 width: '100px',
                 zIndex: 1000}}/>
          </div>

          {/* แถบสีด้านล่าง */}
          <svg style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4vh',
            width: '100vw',
            zIndex: 1000}}>
            <rect x="0" y="0" width="100%" height="100%" fill={data.color} />
          </svg>
      </div>
    );
}

export default TrashDisplay2;