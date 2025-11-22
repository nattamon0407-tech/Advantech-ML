import imgGeneral from '/General.svg'
import imgRecycle from '/Recycle.svg'
import imgUnknown from '/Unknown.svg'

function trashMap(typeTrash) {
    switch (typeTrash) {
        case "General":
            return{
                type: "ขยะทั่วไป",
                image: imgGeneral,
                point: 0,
                category: "General",
                color: "#014180"
            };
        case "Paper":
            return{
                type: "กระดาษ",
                image: imgRecycle,
                point: 1,
                category: "Recycle",
                color: "#ff751f"
            };
        case "Plastic":
            return{
                type: "พลาสติก",
                image: imgRecycle,
                point: 2,
                category: "Recycle",
                color: "#ff751f"
            };
        case "Can":
            return{
                type: 'กระป๋อง',
                image: imgRecycle,
                point: 3,
                category: 'Recycle',
                color: "#ff751f"
            };
        default:
            return{
                type: 'ไม่ทราบประเภท',
                image: imgUnknown,
                point: 0,
                category: "Unknown",
                color: '#808080'
            };
    }
}
export default trashMap;