# Frontend — SlipCheck

Angular 21 แบบ standalone ใช้ TypeScript, Router และ SCSS

## รันโปรเจกต์

เปิด terminal ใน frontend แล้วรัน:

```powershell
npm install
npm start
```

เปิด http://localhost:4200 ส่วน Express รันแยกใน backend ที่พอร์ต 3000

```powershell
npm run build
npm test -- --watch=false
```

## ไฟล์สำคัญ

- src/app/app.ts: root component ควบคุมหน้าจอ
- src/app/app.html: HTML template แยกจาก TypeScript
- src/app/app.routes.ts: เส้นทางหน้าจอ
- src/app/app.config.ts: การตั้งค่า Angular
- src/styles.scss: รูปแบบส่วนกลาง

รอบนี้เป็นโครงเริ่มต้น ยังไม่มี upload, Tailwind, mock หรือการเรียก API ตรวจสลิป ขั้นถัดไปจะทำพร้อม backend ตาม PROJECT_BEAF.md ที่โฟลเดอร์หลัก ห้ามใส่ Thunder API key ใน frontend

## ตั้ง API URL สำหรับ deploy

สร้าง frontend/.env จาก .env.example:

```env
API_BASE_URL=https://your-backend.example.com
```

ไม่เติม /api ท้าย URL เพราะ service เติม /api/health, /api/usage, /api/slips/verify ให้แล้ว
ใช้ npm start สำหรับ development และ npm run build สำหรับ deploy คำสั่งเหล่านี้จะอ่าน .env แล้วสร้าง api.config.ts ให้อัตโนมัติ หากรัน ng serve ตรงๆ ให้รัน node scripts/configure-api.cjs ก่อน
แก้ .env แล้วต้อง restart dev server หรือ build และ deploy ใหม่ ไม่ใช่ runtime config
ระบบ hosting สามารถตั้ง API_BASE_URL เป็น environment variable ตอน build แทนไฟล์ .env ได้ โดยค่าของ hosting จะมีลำดับเหนือกว่าไฟล์
API_BASE_URL จะปรากฏใน JavaScript ของ browser ได้ตามปกติ ห้ามใส่ API key หรือค่าลับใน frontend/.env
ตั้ง CORS_ORIGIN ฝั่ง backend ให้ตรง origin ของ frontend ที่ deploy แล้ว และใช้ HTTPS backend เมื่อ frontend เป็น HTTPS
โฮสต์ Angular แบบ static ให้ตั้ง fallback เส้นทางไป index.html เพื่อเปิด /upload-slip ได้โดยตรง
"# verify-payment-frontend" 
