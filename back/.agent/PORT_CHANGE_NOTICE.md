# Port Change Notice

## Port Changed from 6000 to 3000

The default server port has been changed from **6000** to **3000** due to Chrome/Chromium browser security restrictions.

### Why?

Port 6000 is in Chrome's list of blocked ports (`ERR_UNSAFE_PORT`). Chrome blocks certain ports for security reasons, and port 6000 is one of them.

### Changes Made

- ✅ Default port changed to `3000` in:
  - `src/app.ts`
  - `src/index.ts`
  - `src/identity/infrastructure/express/app.ts`
  - Swagger configuration
  - Postman collection
  - Documentation files

### How to Use

#### Option 1: Use Default Port 3000
```bash
npm run dev
# Server will start on http://localhost:3000
```

#### Option 2: Use Custom Port via Environment Variable
```bash
PORT=8080 npm run dev
# Server will start on http://localhost:8080
```

### Updated URLs

- **API Base**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

### Alternative Safe Ports

If you need a different port, you can use any of these safe ports:
- 3000 (recommended)
- 3001
- 5000
- 8080
- 8081

### Chrome Blocked Ports (Avoid These)

Chrome blocks these ports: 1, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 25, 37, 42, 43, 53, 77, 79, 87, 95, 101, 102, 103, 104, 109, 110, 111, 113, 115, 117, 119, 123, 135, 139, 143, 179, 389, 465, 512, 513, 514, 515, 526, 530, 531, 532, 540, 556, 563, 587, 601, 636, 993, 995, 2049, 3659, 4045, 6000, 6665, 6666, 6667, 6668, 6669, 6697

