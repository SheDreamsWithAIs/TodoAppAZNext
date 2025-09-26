# TodoAppAZNext Backend

## Quick Start

### 1. Activate Virtual Environment
```bash
..\venv\Scripts\Activate.ps1
```

### 2. Run Server
```bash
python backend/app/main.py
```

### 3. Test Health
```bash
curl http://localhost:8000/health
```

## API Endpoints
- `/` - Hello World
- `/health` - Health check
- `/db-test` - Database connection test
- `/auth/*` - Authentication endpoints
- `/tasks/*` - Task management endpoints  
- `/labels/*` - Label management endpoints
