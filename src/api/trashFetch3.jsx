async function trashFetch3() {
  try {
    // เรียกไปที่ API ในเครื่องเดียวกัน (localhost)
    const res = await fetch("http://127.0.0.1:8000/ai-data", {
      method: "GET",
    });

    // กรณี 1: เชื่อมต่อไม่ได้ หรือ Server Error
    if (!res.ok) {
      // ตรวจสอบว่าเป็น 404 หรือ 500 หรือไม่
      console.warn(`Server returned status: ${res.status}`);
      return null;
    }

    // กรณี 2: Server บอกว่า "ไม่มีข้อมูลใหม่" (Status 204)
    if (res.status === 204) {
      return null; // ส่ง null กลับไป หน้าเว็บจะได้ไม่เปลี่ยนหน้า
    }

    // กรณี 3: มีข้อมูล (Status 200)
    const fetchData = await res.json();
    return fetchData; // ส่งข้อมูล { trashType: "Plastic", ... } กลับไป

  } catch (error) {
    console.error("Error connecting to API:", error);
    return null;
  }
}

export default trashFetch3;