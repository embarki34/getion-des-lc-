# Authentication & CORS Configuration Guide

## CORS Error Fix

The CORS error you're experiencing occurs because the backend needs to be configured to allow requests from your frontend origin with credentials.

### Backend Configuration Required

Your backend API (running on `http://10.20.0.69:3000`) needs to have the following CORS configuration:

#### For Express.js Backend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://10.20.0.69:3001', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

#### For NestJS Backend:

```typescript
// main.ts
app.enableCors({
  origin: 'http://10.20.0.69:3001', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

### Important Notes:

1. **DO NOT use wildcard (`*`)** for `Access-Control-Allow-Origin` when using credentials
2. **Specify the exact frontend origin**: `http://10.20.0.69:3001`
3. **Enable credentials**: Set `credentials: true` in CORS config
4. **Include Authorization header** in `allowedHeaders`

### Frontend Configuration (Already Done)

The frontend has been configured to:
- Store JWT token in cookies (client-side)
- Send token via `Authorization: Bearer <token>` header
- Handle 401 errors by redirecting to login
- NOT use `withCredentials` to avoid preflight CORS issues

### Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_API_URL=http://10.20.0.69:3000/api/v1
```

### Testing the Fix

1. Update your backend CORS configuration as shown above
2. Restart your backend server
3. Clear browser cache and cookies
4. Try logging in again

### Alternative: Development Proxy (Optional)

If you can't modify the backend CORS settings, you can use Next.js API routes as a proxy:

```typescript
// app/api/proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const body = await request.json()
  const path = params.path.join('/')
  
  const response = await fetch(`http://10.20.0.69:3000/api/v1/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  
  const data = await response.json()
  return NextResponse.json(data)
}
```

Then update `NEXT_PUBLIC_API_URL` to use the proxy:
```env
NEXT_PUBLIC_API_URL=http://10.20.0.69:3001/api/proxy
```

## Expected Backend Response Format

Your backend `/auth/login` endpoint should return:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

## Troubleshooting

### Still getting CORS errors?
1. Check backend console for CORS configuration logs
2. Verify the origin URL matches exactly (including protocol and port)
3. Check if backend is running on the correct port
4. Try using browser DevTools Network tab to inspect the preflight OPTIONS request

### Token not being sent?
1. Check browser Application tab → Cookies
2. Verify `auth_token` cookie is set
3. Check Network tab → Request Headers for `Authorization: Bearer ...`

### 401 Unauthorized errors?
1. Verify token format is correct
2. Check token expiration
3. Verify backend JWT secret matches
