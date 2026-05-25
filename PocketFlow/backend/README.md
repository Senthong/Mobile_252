# PocketFlow Backend API

Backend API cho ứng dụng PocketFlow được xây dựng bằng **NestJS**.

## Yêu cầu

- Node.js 18+ 
- npm hoặc yarn
- MongoDB 5.0+

## Cài đặt

1. **Cài đặt các gói phụ thuộc**
   ```bash
   npm install
   ```

2. **Thiết lập các biến môi trường**
   ```bash
   cp .env.example .env
   ```

   Cập nhật `.env` với cấu hình của bạn:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/pocketflow
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   CORS_ORIGIN=*
   ```

3. **Khởi động MongoDB** (nếu chạy cục bộ)
   ```bash
   mongod
   ```

## Chạy ứng dụng

### Chế độ phát triển
```bash
npm run dev
```

Server sẽ khởi động tại `http://localhost:3000`

### Build sản xuất
```bash
npm run build
npm run prod
```

### Chế độ debug
```bash
npm run debug
```

## Các điểm cuối API

### Xác thực
- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập người dùng
- `GET /api/auth/profile` - Lấy hồ sơ người dùng (yêu cầu xác thực)
- `PUT /api/auth/profile` - Cập nhật hồ sơ người dùng (yêu cầu xác thực)

### Giao dịch
- `POST /api/transactions` - Tạo giao dịch (yêu cầu xác thực)
- `GET /api/transactions` - Lấy tất cả giao dịch (yêu cầu xác thực)
- `GET /api/transactions/category/:category` - Lấy giao dịch theo danh mục (yêu cầu xác thực)
- `GET /api/transactions/stats/monthly` - Lấy thống kê hàng tháng (yêu cầu xác thực)
- `GET /api/transactions/:id` - Lấy giao dịch theo ID (yêu cầu xác thực)
- `PUT /api/transactions/:id` - Cập nhật giao dịch (yêu cầu xác thực)
- `DELETE /api/transactions/:id` - Xóa giao dịch (yêu cầu xác thực)

### Ngân sách
- `POST /api/budgets` - Tạo ngân sách (yêu cầu xác thực)
- `GET /api/budgets` - Lấy tất cả ngân sách (yêu cầu xác thực)
- `GET /api/budgets/health` - Lấy trạng thái ngân sách (yêu cầu xác thực)
- `GET /api/budgets/:id` - Lấy ngân sách theo ID (yêu cầu xác thực)
- `PUT /api/budgets/:id` - Cập nhật ngân sách (yêu cầu xác thực)
- `DELETE /api/budgets/:id` - Xóa ngân sách (yêu cầu xác thực)

### Kiểm tra sức khỏe
- `GET /api/health` - Điểm cuối kiểm tra sức khỏe

## Thử nghiệm

```bash
# Chạy các bài kiểm tra
npm run test

# Chạy các bài kiểm tra ở chế độ xem
npm run test:watch

# Chạy các bài kiểm tra với mức độ bao phủ
npm run test:cov

# Chạy các bài kiểm tra E2E
npm run test:e2e
```

## Cấu trúc dự án

```
src/
├── modules/
│   ├── auth/              # Mô-đun xác thực
│   │   ├── dto/           # Các đối tượng truyền dữ liệu
│   │   ├── strategies/    # Chiến lược Passport
│   │   ├── guards/        # Bảo vệ xác thực
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   └── auth.module.ts
│   ├── transaction/       # Mô-đun giao dịch
│   │   ├── dto/
│   │   ├── transaction.service.ts
│   │   ├── transaction.controller.ts
│   │   └── transaction.module.ts
│   └── budget/            # Mô-đun ngân sách
│       ├── dto/
│       ├── budget.service.ts
│       ├── budget.controller.ts
│       └── budget.module.ts
├── schemas/               # Các lược đồ Mongoose
│   ├── user.schema.ts
│   ├── transaction.schema.ts
│   └── budget.schema.ts
├── config/                # Các tệp cấu hình
│   ├── database.ts
│   └── env.ts
├── app.module.ts          # Mô-đun ứng dụng chính
├── app.controller.ts
├── app.service.ts
└── main.ts                # Điểm vào
```

## Xác thực

API sử dụng JWT (JSON Web Tokens) để xác thực. Bao gồm token trong tiêu đề `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

## Chất lượng mã

### Kiểm tra linting
```bash
npm run lint
```

### Định dạng
```bash
npm run format
```

## Các biến môi trường

| Biến | Mô tả | Mặc định |
|----------|-------------|---------|
| `PORT` | Cổng máy chủ | 3000 |
| `NODE_ENV` | Môi trường | development |
| `MONGODB_URI` | Chuỗi kết nối MongoDB | mongodb://localhost:27017/pocketflow |
| `JWT_SECRET` | Khóa bí mật JWT | your-secret-key |
| `JWT_EXPIRE` | Thời gian hết hạn JWT | 7d |
| `CORS_ORIGIN` | Nguồn CORS | * |

## Xử lý lỗi

API trả về các phản hồi lỗi được chuẩn hóa:

```json
{
  "statusCode": 400,
  "message": "Thông báo lỗi",
  "error": "Yêu cầu không hợp lệ"
}
```

## Các phụ thuộc

- **@nestjs/** - Khung và mô-đun NestJS
- **mongoose** - Mô hình hóa đối tượng MongoDB
- **passport** - Phần mềm trung gian xác thực
- **jwt** - Xử lý JSON Web Token
- **bcryptjs** - Hashing mật khẩu
- **class-validator** - Xác thực DTO

## Giấy phép

MIT

## Đóng góp

Vui lòng gửi các vấn đề và yêu cầu nâng cao!
