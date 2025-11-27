import React, { useState, useEffect, cloneElement, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import trashFetch3 from '../api/trashFetch3'; // ตรวจสอบ path ให้ถูกต้อง

function TrashTrigger3({ children }) {
  const navigate = useNavigate();
  
  // เก็บข้อมูลคะแนนรวมที่ได้รับมาจาก TrashDisplay (เพื่อส่งไปหน้า Summary)
  const [summaryData, setSummaryData] = useState({ totalPoint: 0 });
  
  // เก็บข้อมูลขยะล่าสุดที่ Fetch เจอ
  const [latestData, setLatestData] = useState(null);
  
  // เก็บเวลาล่าสุดที่มีการเคลื่อนไหว (เจอขยะ)
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  const TIMER_DURATION = 10000; // 10 วินาที

  // 1. ฟังก์ชันรับข้อมูลคะแนนรวมจาก TrashDisplay
  const handleNavigateReady = useCallback((data) => {
      setSummaryData(data); 
  }, []);

  // 2. Logic การรอรับข้อมูล (Polling) *เหมือนหน้า Welcome*
  // ทำงานวนซ้ำทุก 1-2 วินาที เพื่อเช็คว่ามีขยะมาหรือยัง
  useEffect(() => {
    const pollingInterval = setInterval(async () => {
      try {
        const data = await trashFetch3();
        
        // ถ้าเจอข้อมูล และข้อมูลนั้นถูกต้อง (เช็คตามโครงสร้าง API ของคุณ)
        if (data && data.trashType) {
             console.log("New trash detected!", data);
             setLatestData(data); // อัปเดตข้อมูลเพื่อส่งให้ลูก
             setLastActiveTime(Date.now()); // **รีเซ็ตเวลาเมื่อเจอขยะ**
        }
      } catch (error) {
        console.error("Polling Error:", error);
      }
    }, 1000); // เช็คทุกๆ 1 วินาที (ปรับความถี่ได้ตามชอบ)

    return () => clearInterval(pollingInterval);
  }, []);

  // 3. Logic ตัดจบเกม (Timeout)
  // เช็คตลอดเวลาว่า เวลาปัจจุบัน เกินเวลาล่าสุด+10วิ หรือยัง
  useEffect(() => {
    const timeoutCheck = setInterval(() => {
        const timeDiff = Date.now() - lastActiveTime;
        if (timeDiff > TIMER_DURATION) {
            // หมดเวลา -> ไปหน้า Summary
            navigate("/summary", { state: summaryData });
        }
    }, 500); // เช็คเงื่อนไขทุก 0.5 วินาที

    return () => clearInterval(timeoutCheck);
  }, [lastActiveTime, navigate, summaryData]);

  return (
    <div>
      {/* ส่ง externalData (ข้อมูลที่ fetch ได้) และ onNavigateReady ลงไปให้ลูก 
         ลูก (TrashDisplay) ต้องเขียนรับ props ชื่อ externalData ไปแสดงผล
      */}
      {children && React.isValidElement(children) && cloneElement(children, { 
            externalData: latestData, 
            onNavigateReady: handleNavigateReady 
      })}
    </div>
  );
}

export default TrashTrigger3;