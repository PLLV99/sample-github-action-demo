# 🚀 Quick Start Guide - Express + GitHub Actions

## ขั้นตอนเริ่มต้นแบบด่วน (5 นาที)

### 1️⃣ ติดตั้ง Dependencies

```bash
cd sample-github-action
npm install
```

### 2️⃣ สร้างไฟล์ .env

```bash
cp .env.example .env
```

### 3️⃣ รัน Application

```bash
npm start
```

เปิดเบราว์เซอร์: http://localhost:3000

### 4️⃣ ทดสอบ API

```bash
# Test root endpoint
curl http://localhost:3000/

# Test health check
curl http://localhost:3000/health

# Test get all users
curl http://localhost:3000/api/users

# Test create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### 5️⃣ รัน Tests

```bash
npm test
```

---

## 🐳 Quick Start with Docker

### Build และ Run

```bash
docker build -t express-app .
docker run -p 3000:3000 express-app
```

### หรือใช้ Docker Compose

สร้างไฟล์ `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
```

รัน:

```bash
docker-compose up
```

---

## ⚙️ ตั้งค่า GitHub Actions (ใช้เวลา 2 นาที)

### 1. สร้าง Docker Hub Access Token

1. ไปที่ https://hub.docker.com/settings/security
2. คลิก **New Access Token**
3. ตั้งชื่อ: `github-actions`
4. คัดลอก token

### 2. เพิ่ม Secrets ใน GitHub

1. ไปที่ Repository → **Settings** → **Secrets and variables** → **Actions**
2. คลิก **New repository secret**
3. เพิ่ม:
   - `DOCKERHUB_USERNAME`: your_username
   - `DOCKERHUB_TOKEN`: your_token

### 3. แก้ไข Workflow

เปิดไฟล์ `.github/workflows/main.yml`:

```yaml
env:
  DOCKER_IMAGE: 'yourusername/express-app'  # เปลี่ยนเป็น username ของคุณ
```

### 4. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 5. ดูผลลัพธ์

ไปที่แท็บ **Actions** ใน GitHub Repository

---

## 📝 สรุปคำสั่งที่ใช้บ่อย

```bash
# Development
npm install              # ติดตั้ง dependencies
npm run dev             # รันแบบ development mode (auto-reload)
npm test                # รัน tests
npm run test:watch      # รัน tests แบบ watch mode

# Production
npm start               # รันแบบ production mode

# Docker
docker build -t express-app .                    # Build image
docker run -p 3000:3000 express-app             # Run container
docker ps                                        # ดู running containers
docker logs express-app                          # ดู logs

# Git
git add .                                        # Add files
git commit -m "message"                         # Commit
git push origin main                            # Push to main branch
```

---

## ✅ Checklist สำหรับการ Deploy

- [ ] ติดตั้ง dependencies สำเร็จ (`npm install`)
- [ ] Tests ผ่านหมด (`npm test`)
- [ ] Docker build สำเร็จ
- [ ] ตั้งค่า GitHub Secrets แล้ว
- [ ] แก้ไข DOCKER_IMAGE ใน workflow แล้ว
- [ ] Push code ไป GitHub แล้ว
- [ ] GitHub Actions workflow รันสำเร็จ
- [ ] Docker image ถูก push ไป Docker Hub แล้ว

---

## 🆘 ปัญหาที่พบบ่อย

### Tests ล้มเหลว
```bash
rm -rf node_modules package-lock.json
npm install
npm test
```

### Docker build error
```bash
docker build --no-cache -t express-app .
```

### GitHub Actions error
- ตรวจสอบว่าตั้งค่า Secrets ครบ
- ตรวจสอบว่า DOCKER_IMAGE ถูกต้อง
- ดู logs ใน Actions tab

---

## 📚 เอกสารเพิ่มเติม

- [README.md](README.md) - เอกสารฉบับเต็ม
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**พร้อมใช้งานแล้ว! 🎉**
