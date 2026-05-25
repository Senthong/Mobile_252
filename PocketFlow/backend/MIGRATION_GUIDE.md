# Hướng dẫn Di chuyển Backend NestJS

Tài liệu này phác thảo việc tái cấu trúc từ Express.js sang khung NestJS cho backend PocketFlow.

## Những gì đã thay đổi

### Di chuyển Framework
- **Từ:** Express.js + middleware tùy chỉnh
- **Đến:** NestJS (được xây dựng trên Express.js) + decorators và modules

### Những cải tiến chính

1. **Kiến trúc dựa trên Module**
   - Tổ chức mã vào các mô-đun tính năng (Xác thực, Giao dịch, Ngân sách)
   - Tách biệt mối quan tâm tốt hơn
   - Dễ dàng mở rộng quy mô và bảo trì

2. **Tiêm phụ thuộc**
   - Container DI tích hợp sẵn NestJS
   - Đăng ký và tiêm dịch vụ tự động
   - Khả năng kiểm tra tốt hơn

3. **Phương pháp dựa trên Decorators**
   - `@Controller()`, `@Injectable()`, `@UseGuards()`, v.v.
   - Mã sạch hơn và dễ đọc hơn
   - Ít mã boilerplate

4. **Xác thực an toàn kiểu**
   - `class-validator` với DTOs
   - Đảm bảo kiểu ngay từ hộp
   - Xác thực yêu cầu tự động

5. **Bảo vệ và Interceptors tích hợp sẵn**
   - `JwtAuthGuard` cho các tuyến đường được bảo vệ
   - Tích hợp Passport.js
   - Phần mềm trung gian xử lý lỗi

## Thay đổi cấu trúc thư mục

### Trước (Express)
```
src/
├── server.ts                 # Điểm vào
├── config/
│   ├── database.ts
│   └── env.ts
├── controllers/
│   ├── authController.ts
│   ├── transactionController.ts
│   └── budgetController.ts
├── models/
│   ├── User.ts
│   ├── Transaction.ts
│   └── Budget.ts
├── routes/
│   ├── auth.ts
│   ├── transactions.ts
│   └── budgets.ts
└── middleware/
    └── auth.ts
```

### Sau (NestJS)
```
src/
├── main.ts                   # Điểm vào (khởi động NestJS)
├── app.module.ts             # Mô-đun gốc
├── app.controller.ts         # Bộ điều khiển gốc (kiểm tra sức khỏe)
├── app.service.ts            # Dịch vụ gốc
├── config/
│   ├── database.ts
│   └── env.ts
├── schemas/                  # Lược đồ Mongoose
│   ├── user.schema.ts
│   ├── transaction.schema.ts
│   └── budget.schema.ts
└── modules/
    ├── auth/
    │   ├── dto/
    │   │   ├── register.dto.ts
    │   │   ├── login.dto.ts
    │   │   └── update-profile.dto.ts
    │   ├── guards/
    │   │   └── jwt.guard.ts
    │   ├── strategies/
    │   │   └── jwt.strategy.ts
    │   ├── auth.service.ts
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   └── auth.service.spec.ts
    ├── transaction/
    │   ├── dto/
    │   │   ├── create-transaction.dto.ts
    │   │   └── update-transaction.dto.ts
    │   ├── transaction.service.ts
    │   ├── transaction.controller.ts
    │   ├── transaction.module.ts
    │   └── transaction.service.spec.ts
    └── budget/
        ├── dto/
        │   ├── create-budget.dto.ts
        │   └── update-budget.dto.ts
        ├── budget.service.ts
        ├── budget.controller.ts
        ├── budget.module.ts
        └── budget.service.spec.ts
```

## Những thay đổi mã chính

### Điểm vào

**Trước (Express):**
```typescript
// src/server.ts
import express from 'express';
const app = express();
app.use(helmet());
app.listen(PORT);
```

**Sau (NestJS):**
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
const app = await NestFactory.create(AppModule);
await app.listen(port);
```

### Bộ điều khiển

**Trước (Express):**
```typescript
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.status(201).json({ token });
};

router.post('/register', [validation], register);
```

**Sau (NestJS):**
```typescript
@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
```

### Dịch vụ

**Trước (Express):**
```typescript
export const register = async (req, res) => {
  // logic here
};
```

**Sau (NestJS):**
```typescript
@Injectable()
export class AuthService {
  async register(registerDto: RegisterDto) {
    // logic here
  }
}
```

### Mô-đun

**Trước (Express):**
- Nhập tuyến đường thủ công
- Không có cấu trúc mô-đun chính thức

**Sau (NestJS):**
```typescript
@Module({
  imports: [PassportModule, JwtModule, MongooseModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### Xác thực

**Trước (Express):**
```typescript
app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  jwt.verify(token, secret);
});
```

**Sau (NestJS):**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@Request() req) {
  return req.user;
}
```

## Cài đặt và thiết lập

### 1. Cài đặt phụ thuộc
```bash
npm install
```

### 2. Thiết lập biến môi trường
```bash
cp .env.example .env
```

Cập nhật `.env` nếu cần thiết (mặc định hoạt động cho phát triển cục bộ)

### 3. Khởi động MongoDB
```bash
# Tùy chọn 1: Sử dụng Docker
docker-compose up -d

# Tùy chọn 2: MongoDB cục bộ
mongod
```

### 4. Chạy máy chủ phát triển
```bash
npm run dev
```

## Các kịch bản sẵn có

| Kịch bản | Mục đích |
|--------|---------|
| `npm run dev` | Bắt đầu với tải lại tự động (chế độ xem) |
| `npm run build` | Biên dịch TypeScript thành JavaScript |
| `npm run start` | Chạy bản dựng sản xuất |
| `npm run debug` | Chế độ gỡ lỗi với trình kiểm tra |
| `npm run test` | Chạy bài kiểm tra đơn vị |
| `npm run test:cov` | Chạy các bài kiểm tra với báo cáo phạm vi bao phủ |
| `npm run lint` | Kiểm tra linting các tệp TypeScript |
| `npm run format` | Định dạng mã bằng Prettier |

## Các điểm cuối API (Giống như trước đây)

Tất cả các điểm cuối API vẫn giữ nguyên:

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile

GET /api/transactions
POST /api/transactions
GET /api/transactions/:id
PUT /api/transactions/:id
DELETE /api/transactions/:id

GET /api/budgets
POST /api/budgets
GET /api/budgets/:id
PUT /api/budgets/:id
DELETE /api/budgets/:id
```

## Quy trình xác thực

1. Người dùng đăng ký bằng email và mật khẩu
2. Backend lưu trữ mật khẩu bằng bcryptjs
3. Mã token JWT được tạo bằng ID người dùng và email
4. Token được trả về cho máy khách
5. Máy khách bao gồm token trong tiêu đề `Authorization: Bearer <token>`
6. `JwtAuthGuard` xác thực token cho các tuyến đường được bảo vệ
7. Thông tin người dùng được tiêm vào tham số `@Request()`

## Thử nghiệm

```bash
# Bài kiểm tra đơn vị
npm run test

# Với phạm vi bao phủ
npm run test:cov

# Chế độ xem
npm run test:watch
```

## Xử lý lỗi

NestJS cung cấp xử lý lỗi tự động:

```typescript
throw new BadRequestException('Email already exists');  // 400
throw new UnauthorizedException('Invalid token');      // 401
throw new NotFoundException('User not found');          // 404
throw new InternalServerErrorException();              // 500
```

## Các phụ thuộc

| Gói | Mục đích |
|---------|---------|
| `@nestjs/core` | Khung NestJS cốt lõi |
| `@nestjs/common` | Decorators và tiện ích chung |
| `@nestjs/mongoose` | Tích hợp Mongoose |
| `@nestjs/jwt` | Xử lý JWT |
| `@nestjs/passport` | Xác thực Passport |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Lưu trữ mật khẩu |
| `class-validator` | Xác thực DTO |
| `passport` | Thư viện xác thực |

## Cấu hình

### Các biến môi trường (.env)
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/pocketflow
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

## Các vấn đề phổ biến

### Vấn đề: "Cannot find module @nestjs/core"
**Giải pháp:** Chạy `npm install`

### Vấn đề: Kết nối MongoDB không thành công
**Giải pháp:** 
- Khởi động MongoDB: `mongod` hoặc `docker-compose up`
- Kiểm tra MONGODB_URI trong .env

### Vấn đề: Lỗi mã token JWT
**Giải pháp:** 
- Đảm bảo JWT_SECRET được đặt trong .env
- Bao gồm `Bearer` trong tiêu đề Authorization

## Tài nguyên học tập

- [Tài liệu NestJS](https://docs.nestjs.com)
- [Sổ tay TypeScript](https://www.typescriptlang.org/docs)
- [Tài liệu Mongoose](https://mongoosejs.com)
- [Hướng dẫn Passport.js](http://www.passportjs.org)

## Thử nghiệm API

### Đăng ký
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Đăng nhập
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Lấy hồ sơ (với token)
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

## Những cải tiến về hiệu suất

1. **Xác thực tự động** - Xác thực đầu vào mà không cần kiểm tra thủ công
2. **Tải lười** - Mô-đun được tải theo yêu cầu
3. **Tối ưu hóa Middleware** - NestJS tối ưu hóa thứ tự middleware
4. **Biên dịch TypeScript** - Kiểm tra kiểu chặt chẽ hơn
5. **Tối ưu hóa DI** - Mô hình Singleton theo mặc định

## Các bước tiếp theo

1. Cài đặt các phụ thuộc: `npm install`
2. Thiết lập các biến môi trường
3. Khởi động MongoDB
4. Chạy `npm run dev`
5. Kiểm tra các điểm cuối bằng Postman hoặc curl
6. Triển khai vào sản xuất

---

**Mã hóa vui vẻ!**
