# Smart Market — Full Stack Project Documentation

**Student Name:** KUPPALA SURYA TEJA  
**Roll Number:** 25765A0536  
**Institution:** Lakireddy Bali Reddy College of Engineering (Autonomous), Mylavaram  
**Department:** Computer Science and Engineering  
**Course:** FULL STACK DEVELOPMENT-II (23CSS3)  
**Supervisor:** Mr. N. SrinivasaRao, Sr. Assistant Professor  

---

## 1. Overview & Architecture

Smart Market is an institutional-grade financial analytics terminal and trade repository.
- **Frontend:** React 19 + TypeScript + Tailwind CSS (Vite dev server on port 3000)
- **Backend:** Java Servlets (Java 17, Apache Tomcat 9, port 8089/8081)
- **Database:** Oracle Database Express Edition (XE), port 1521 (SID: `XE`)
- **Security:** PBKDF2 with HMAC-SHA256 (210,000 iterations + 16-byte cryptographically secure random salt)

---

## 2. Relational Database Schema (`database.sql`)

### Tables:
1. **`USERS`**: `id`, `name`, `email` (unique), `password_hash`, `role`, `specialty`, `plan`, `joined_date`, `avatar_url`
2. **`RESEARCH_NOTES`**: `id`, `user_id` (FK to `USERS(id)` ON DELETE CASCADE), `note_date`, `symbol`, `category`, `setup_type`, `key_level`, `target_outlook`, `timeframe`, `thesis` (CLOB), `created_at`
3. **`PRICE_ALERTS`**: `id`, `user_id` (FK to `USERS(id)` ON DELETE CASCADE), `symbol`, `target_price`, `condition`, `created_at`, `triggered`

---

## 3. REST API Endpoints

| Verb | Path | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account with PBKDF2 hash |
| `POST` | `/api/auth/login` | Authenticate user credentials |
| `GET` | `/api/journal?userId={id}` | Retrieve research notes for user |
| `POST` | `/api/journal` | Persist new research note |
| `DELETE` | `/api/journal/{id}?userId={id}` | Delete specific research note |
| `GET` | `/api/alerts?userId={id}` | Fetch active price alerts |
| `POST` | `/api/alerts` | Create new price alert |
| `DELETE` | `/api/alerts/{id}?userId={id}` | Dismiss / delete price alert |

---

## 4. Setup & Running Instructions

### Backend (Java Tomcat + Oracle):
1. Import `backend/` into Eclipse IDE as a Maven project or compile using `pom.xml`.
2. Execute `backend/database.sql` in Oracle SQL*Plus or SQL Developer.
3. Deploy to Apache Tomcat 9 (`http://localhost:8089/smart-market/`).

### Frontend (React 19 + Vite):
1. Run `pnpm install` in the project root.
2. Run `pnpm dev` to start the frontend on `http://localhost:3000`.
3. Vite proxies all `/api/*` requests to Tomcat at `http://localhost:8089`.

---

## 5. Inspection Utility
Run `backend/view_data.bat` to query and view all Oracle tables formatted cleanly in the console without SQL*Plus line wrapping.
