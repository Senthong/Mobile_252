# Hướng dẫn Bắt đầu Nhanh - Backend NestJS

## Thiết lập 5 phút

### Bước 1: Cài đặt phụ thuộc
```bash
cd backend
npm install
```

### Bước 2: Khởi động MongoDB (Chọn một)

**Tùy chọn A: Docker**
```bash
docker-compose up -d
# MongoDB: localhost:27017
# Giao diện Mongo Express: http://localhost:8081
```

**Tùy chọn B: MongoDB cục bộ**
```bash
mongod
```

### Bước 3: Thiết lập môi trường
```bash
cp .env.example .env
# Chỉnh sửa .env nếu cần (mặc định hoạt động cho phát triển cục bộ)
```

### Bước 4: Khởi động máy chủ phát triển
```bash
npm run dev
```

API của bạn hiện đang chạy tại: **http://localhost:3000**

---

## Thử nghiệm API nhanh chóng

### 1. Đăng ký người dùng
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Phản hồi:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "fullName": "Test User",
    "tier": "HẠNG ĐỒNG"
  }
}
```

### 2. Tạo giao dịch
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 50000,
    "type": "expense",
    "category": "Food",
    "note": "Lunch",
    "date": "2026-05-25T10:00:00Z",
    "account": "cash"
  }'
```

### 3. Tạo ngân sách
```bash
curl -X POST http://localhost:3000/api/budgets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "categoryId": "food-001",
    "categoryName": "Food",
    "limit": 5000000,
    "month": 5,
    "year": 2026
  }'
```

### 4. Lấy trạng thái ngân sách
```bash
curl -X GET "http://localhost:3000/api/budgets/health?month=5&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Cấu trúc dự án

```
backend/
├── src/
│   ├── main.ts                 # Điểm vào ứng dụng
│   ├── app.module.ts           # Mô-đun gốc
│   ├── modules/
│   │   ├── auth/               # Xác thực
│   │   ├── transaction/        # Giao dịch
│   │   └── budget/             # Ngân sách
│   ├── schemas/                # Lược đồ MongoDB
│   ├── config/                 # Cấu hình
│   └── main.ts
├── dist/                       # Đầu ra đã biên dịch
├── package.json
├── tsconfig.json
├── .env                        # Các biến môi trường
└── README.md
```

---

## Các lệnh phổ biến

| Lệnh | Mục đích |
|---------|---------|
| `npm run dev` | Khởi động máy chủ phát triển (tải lại tự động) |
| `npm run build` | Xây dựng cho sản xuất |
| `npm run start` | Chạy bản dựng sản xuất |
| `npm run test` | Chạy bài kiểm tra đơn vị |
| `npm run lint` | Kiểm tra chất lượng mã |
| `npm run format` | Định dạng mã bằng Prettier |
| `npm run debug` | Bắt đầu với trình gỡ lỗi |

---

## Xác thực

Tất cả các điểm cuối được bảo vệ yêu cầu mã token JWT trong tiêu đề:

```
Authorization: Bearer <your-token>
```

Các điểm cuối được bảo vệ:
- ✓ `/api/auth/profile`
- ✓ `/api/transactions` (tất cả)
- ✓ `/api/budgets` (tất cả)

---

## Các điểm cuối API

### Xác thực
- `POST /api/auth/register` - Tạo tài khoản
- `POST /api/auth/login` - Lấy mã token
- `GET /api/auth/profile` - Lấy hồ sơ (yêu cầu xác thực)
- `PUT /api/auth/profile` - Cập nhật hồ sơ (yêu cầu xác thực)

### Giao dịch
- `GET /api/transactions` - Liệt kê tất cả
- `POST /api/transactions` - Tạo
- `GET /api/transactions/:id` - Lấy một
- `PUT /api/transactions/:id` - Cập nhật
- `DELETE /api/transactions/:id` - Xóa
- `GET /api/transactions/category/:category` - Theo danh mục
- `GET /api/transactions/stats/monthly?month=5&year=2026` - Thống kê hàng tháng

### Ngân sách
- `GET /api/budgets` - Liệt kê tất cả
- `POST /api/budgets` - Tạo
- `GET /api/budgets/:id` - Lấy một
- `PUT /api/budgets/:id` - Cập nhật
- `DELETE /api/budgets/:id` - Xóa
- `GET /api/budgets/health?month=5&year=2026` - Trạng thái ngân sách

### Sức khỏe
- `GET /api/health` - Trạng thái máy chủ

---

## Biến môi trường

```env
PORT=3000                                              # Cổng máy chủ
NODE_ENV=development                                   # Môi trường nút
MONGODB_URI=mongodb://localhost:27017/pocketflow      # Kết nối MongoDB
JWT_SECRET=your-secret-key-change-in-production      # Bí mật JWT
JWT_EXPIRE=7d                                         # Hết hạn mã token
CORS_ORIGIN=*                                        # Nguồn CORS được phép
```

---

## Khắc phục sự cố

**Q: Cổng 3000 đã được sử dụng?**
```bash
# Sử dụng một cổng khác
PORT=3001 npm run dev
```

**Q: Kết nối MongoDB không thành công?**
```bash
# Đảm bảo MongoDB đang chạy
docker-compose up -d  # hoặc mongod nếu cục bộ
```

**Q: Không tìm thấy mô-đun?**
```bash
# Cài đặt lại các phụ thuộc
rm -rf node_modules package-lock.json
npm install
```

**Q: Lỗi kiểu trong trình soạn thảo?**
```bash
# Khởi động lại VS Code hoặc chạy
npm run build
```

---

## Thiết lập Docker

### Khởi động dịch vụ với Docker
```bash
docker-compose up -d
```

### Xem nhật ký
```bash
docker-compose logs -f mongodb
```

### Dừng dịch vụ
```bash
docker-compose down
```

### Truy cập Mongo Express
Mở: http://localhost:8081

---

## Các liên kết hữu ích

- [Tài liệu NestJS](https://docs.nestjs.com)
- [Tài liệu MongoDB](https://docs.mongodb.com)
- [Tài liệu Mongoose](https://mongoosejs.com)
- [JWT.io](https://jwt.io)

---

## Danh sách kiểm tra

- [ ] Các phụ thuộc được cài đặt (`npm install`)
- [ ] MongoDB đang chạy
- [ ] Tệp `.env` được tạo
- [ ] Máy chủ bắt đầu (`npm run dev`)
- [ ] Các điểm cuối kiểm tra hoạt động
- [ ] Sẵn sàng phát triển!

---

**Cần trợ giúp?** Kiểm tra `MIGRATION_GUIDE.md` hoặc `README.md` để biết thêm chi tiết.
