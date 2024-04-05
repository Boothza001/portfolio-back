const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// สร้าง middleware สำหรับการแก้ปัญหา CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // อนุญาตให้เรียก API จากทุกๆ โดเมน
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS" // ระบุว่าเมทอด HTTP ใดๆ ก็ได้สามารถใช้งานได้
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization" // ระบุว่าหัวข้อที่ส่งไปใน request headers ได้แก่ Content-Type และ Authorization
  );
  next(); // ไปยัง middleware ถัดไป
});

// เชื่อมต่อกับ MongoDB
mongoose.connect(
  "mongodb+srv://root:1234@cluster0.71yxj9m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;

// สร้างโครงสร้างข้อมูลสำหรับ MongoDB
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});
const Contact = mongoose.model("Contact", contactSchema);

// ใช้ bodyParser เพื่ออ่านข้อมูลจาก body ของ HTTP request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST endpoint สำหรับบันทึกข้อมูลลงใน MongoDB
app.post("/api/contact", async (req, res) => {
  const { name, email, phone } = req.body;

  // สร้าง instance ของ Contact model
  const newContact = new Contact({
    name: name,
    email: email,
    phone: phone,
  });

  try {
    const contact = await newContact.save();
    res
      .status(200)
      .json({ message: "บันทึกข้อมูลเรียบร้อยแล้ว", contact: contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

// เริ่มต้น Express server ที่พอร์ต 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
