import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundGif from '/ReX.gif';
import './trash_main.module.css';
import trashFetch3 from './api/trashFetch3';

const WelcomePage2 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // สร้างฟังก์ชัน async เพื่อรอข้อมูล
    const initData = async () => {
      console.log("Start fetching initial data...");
      
      // 1. เรียก API
      const data = await trashFetch3();

      // 2. ถ้าได้ข้อมูลมาแล้ว ให้เปลี่ยนหน้าพร้อมส่งข้อมูลไปด้วย
      if (data) {
        console.log("Data received, navigating...", data);
        navigate('/mainpage', { 
            state: { initialData: data }  // ส่งข้อมูลไปในชื่อ initialData
        });
      } else {
        // กรณี Error หรือไม่ข้อมูล (อาจจะให้แสดงปุ่ม Reload หรือ Alert)
        console.error("Failed to fetch initial data.");
      }
    };

    initData(); // เรียกใช้งานฟังก์ชันทันทีที่หน้านี้โหลด
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img src={backgroundGif} alt="Welcome GIF" style={styles.backgroundGif} />
    </div>
  );
};

const styles = {
  container: { position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' },
  backgroundGif: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1
  }
};

export default WelcomePage2;