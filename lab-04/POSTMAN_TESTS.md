# Lab 4 Postman Test Plan

Start the server with `npm start` and create a Postman collection named **Lab 4 - Registration, Login and JWT**. Use `http://localhost:3000` as the base URL.

For every request choose **Body → raw → JSON** and set `Content-Type: application/json`.

## 1. Register a new user — expected 201
`POST {{baseUrl}}/register`
```json
{
  "username": "student01",
  "name": "Student One",
  "password": "StrongPass123"
}
```
Expected:
```json
{"message":"User registered successfully."}
```

## 2. Register the same username again — expected 400
Repeat the registration request above. Expected:
```json
{"message":"Username already exists."}
```

## 3. Login with correct credentials — expected 200
`POST {{baseUrl}}/login`
```json
{
  "username": "student01",
  "password": "StrongPass123"
}
```
Expected response contains a `jwt_token` string. Copy the token for the jwt.io exercise.

## 4. Login with an unknown username — expected 400
`POST {{baseUrl}}/login`
```json
{
  "username": "unknown_user",
  "password": "StrongPass123"
}
```
Expected:
```json
{"message":"Invalid username or password."}
```

## 5. Login with a wrong password — expected 400
`POST {{baseUrl}}/login`
```json
{
  "username": "student01",
  "password": "WrongPass123"
}
```
Expected:
```json
{"message":"Invalid username or password."}
```

## 6. Register with missing fields — expected 400
`POST {{baseUrl}}/register`
```json
{
  "username": "incomplete"
}
```
Expected response explains that username, name and password are required.

## 7. Decode the JWT
1. Open https://jwt.io/.
2. Paste the token returned by the successful login into the debugger.
3. Inspect the decoded header and payload.
4. Confirm that the payload contains `username` (and standard JWT timing claims), but no password or password hash.
5. The signature may show as unverifiable unless the matching secret is supplied. Do not publish the secret or paste it into screenshots.

## 8. Verify the stored password hash
Open `library.db` using a SQLite viewer and inspect:
```sql
SELECT username, name, password FROM user;
```
The `password` column should contain a bcrypt hash beginning with a bcrypt marker such as `$2b$`, not the submitted plaintext password. Do not include actual passwords in screenshots.

## Screenshot checklist
Save genuine screenshots in `screenshots/`:
- `register-success.png`
- `register-duplicate.png`
- `login-success.png`
- `login-unknown-user.png`
- `login-wrong-password.png`
- `database-password-hash.png`
- `jwt-decode.png`
