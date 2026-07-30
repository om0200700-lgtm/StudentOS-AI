# API Documentation

All API endpoints are prefixed with `/api` and run on `http://localhost:5000` locally.
Most routes are protected and require a valid JWT token in the `Authorization` header (`Bearer <token>`).

## Authentication API (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `POST` | `/register` | Register a new user | No | `name`, `email`, `password`, `branch`, `semester` |
| `POST` | `/login` | Authenticate user & get token | No | `email`, `password` |
| `GET`  | `/me` | Get current logged-in user details | Yes | None |
| `PUT`  | `/profile` | Update user profile | Yes | `name`, `branch`, `semester` |
| `POST` | `/forgot-password`| Request password reset | No | `email` |

## Attendance API (`/api/attendance`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get all attendance records | Yes | None |
| `POST` | `/` | Create a new subject | Yes | `subject`, `totalClasses`, `attendedClasses` |
| `PUT`  | `/:id` | Update an existing subject | Yes | `subject`, `totalClasses`, `attendedClasses` |
| `DELETE`| `/:id` | Delete an attendance subject | Yes | None |
| `POST` | `/:id/log` | Increment attendance logs | Yes | `status` ('present' \| 'absent') |

## CGPA API (`/api/cgpa`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get all semester grades | Yes | None |
| `POST` | `/` | Add a new semester record | Yes | `semester`, `sgpa`, `credits` |
| `PUT`  | `/:id` | Update a semester record | Yes | `sgpa`, `credits` |
| `DELETE`| `/:id` | Delete a semester record | Yes | None |

## Planner API (`/api/planner`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/tasks` | Get all planner tasks | Yes | None |
| `POST` | `/tasks` | Create a new task | Yes | `title`, `subject`, `type`, `dueDate`, `priority` |
| `PUT`  | `/tasks/:id` | Update a task (e.g. status) | Yes | `status`, `title`, etc. |
| `DELETE`| `/tasks/:id`| Delete a task | Yes | None |
| `POST` | `/sessions` | Log a Pomodoro study session | Yes | `durationMinutes`, `subject` |
| `GET`  | `/analytics`| Get study session analytics | Yes | None |

## Coding API (`/api/coding`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get coding profile stats | Yes | None |
| `PUT`  | `/` | Update coding profile | Yes | `stats`, `topics`, `platforms`, `streak` |

## Placement API (`/api/placement`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get placement readiness checklist | Yes | None |
| `PUT`  | `/` | Update placement checklist | Yes | `dsa`, `coreSubjects`, `aptitude`, etc. |

## Analytics API (`/api/analytics`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/dashboard` | Get comprehensive dashboard data | Yes | None |

## Admin API (`/api/admin`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/users` | Get system users (students, faculty) | Yes (Admin) | None |
| `GET`  | `/stats` | Get admin dashboard statistics | Yes (Admin) | None |

## Fee API (`/api/fees`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get all fees (Admin) or my fees (Student) | Yes | None |
| `POST` | `/` | Create a new fee record | Yes (Admin) | `student`, `semester`, `totalAmount`, `dueDate`, `description` |
| `PUT`  | `/:id/pay` | Pay fee amount | Yes | `amount`, `method` |
| `GET`  | `/stats` | Get fee collection statistics | Yes (Admin) | None |

## Exam API (`/api/exams`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `GET`  | `/` | Get all exams | Yes | None |
| `POST` | `/` | Schedule a new exam | Yes (Admin) | `title`, `type`, `semester`, `branch`, `startDate`, `endDate`, `subjects` |
| `PUT`  | `/:id` | Update an exam | Yes (Admin) | Updates object |
| `DELETE`| `/:id`| Delete an exam | Yes (Admin) | None |

## Upload API (`/api/upload`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| `POST` | `/avatar` | Upload user avatar image | Yes | `multipart/form-data` with `avatar` field |
| `POST` | `/document` | Upload generic document | Yes | `multipart/form-data` with `document` field |
