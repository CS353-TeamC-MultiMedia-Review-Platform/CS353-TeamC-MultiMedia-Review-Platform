# Backend Authentication Tests

Tests for protected backend endpoints with invalid/missing tokens.

## Running the Tests

1. **Start the backend server:**
```bash
cd backend
npm run dev
```

The server should be running on `http://localhost:5001`

2. **In another terminal, run the authentication tests:**
```bash
cd backend
node tests/auth-tests.js
```

## Test Cases

### 1. Create Review - NO TOKEN
- **Expected:** `401 Unauthorized`
- **Tests:** Endpoint rejects requests without authentication header

### 2. Create Review - INVALID TOKEN
- **Expected:** `401 Unauthorized`  
- **Tests:** Endpoint rejects requests with invalid JWT tokens

### 3. Create Review - MALFORMED AUTH HEADER
- **Expected:** `401 Unauthorized`
- **Tests:** Endpoint rejects requests with malformed Authorization headers

### 4. Get Reviews - NO TOKEN (Public Endpoint)
- **Expected:** `200 OK`
- **Tests:** Public endpoints work without authentication

## Protected Endpoints

The following endpoints now require authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews/create` | Create a new review (requires auth token) |
| PUT | `/reviews/:id` | Update a review (requires auth token) |
| DELETE | `/reviews/:id` | Delete a review (requires auth token) |
| GET | `/reviews/user/:id` | Get user reviews (requires auth token) |

## Public Endpoints

These endpoints work without authentication:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | Get all reviews (paginated) |
| GET | `/reviews/:id` | Get single review by ID |

## How Authentication Works

1. **Frontend** sends request with JWT token in Authorization header:
   ```
   Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Backend middleware** (`authMiddleware`) verifies the token:
   - Extracts token from `Authorization` header
   - Verifies token with Firebase Admin SDK
   - Attaches decoded user info to `req.user`
   - Rejects invalid/missing tokens with `401 Unauthorized`

3. **Protected endpoint** uses authenticated user:
   - Checks `req.user.uid` from middleware
   - Verifies user owns the resource (for update/delete)
   - Returns `403 Forbidden` if user tries to modify another user's data

## Expected Test Output

```
🧪 Starting Backend Authentication Tests

Testing against: http://localhost:5001

✅ Create review - NO TOKEN (should return 401)
   Expected: 401, Got: 401

✅ Create review - INVALID TOKEN (should return 401)
   Expected: 401, Got: 401

✅ Create review - MALFORMED AUTH HEADER (should return 401)
   Expected: 401, Got: 401

✅ Get reviews - NO TOKEN (should return 200 - public endpoint)
   Expected: 200, Got: 200


📊 Test Results: 4 passed, 0 failed
```

## Testing with Real Token

To test with a real token:

1. **Login through the app** to get a valid JWT token
2. **Copy the token** from browser localStorage or Network tab
3. **Use it in Postman:**
   - Set Header: `Authorization: Bearer <your-token>`
   - POST to `http://localhost:5001/reviews/create`
   - Should succeed with `201 Created`

## Troubleshooting

- **Connection refused:** Make sure backend is running on port 5001
- **Test fails:** Check that Firebase service account key is set up correctly
- **Invalid token error:** Ensure you're using a token from the same Firebase project
