# TodoAppAZNext Backend

## Quick Start

### Prerequisites
- Ensure you have a `.env` file in the backend directory (`C:\Dev\TodoAppAZNext\backend\.env`) with your MongoDB connection string:
  ```
  MONGO_URI=mongodb+srv://your-connection-string
  APP_ENV=dev
  ```

### Running the Server
```powershell
# Navigate to project root
cd C:\Dev\TodoAppAZNext

# Set Python path and run server
$env:PYTHONPATH = "C:\Dev\TodoAppAZNext\backend"; python -m uvicorn app.main:app --reload --port 8000
```

### Verify Server is Running
- Check console output for: `Connected to DB: TodoAppAZNext_dev (env=dev)`
- Test health endpoint: `http://localhost:8000/health`
- Test database: `http://localhost:8000/db-test`

## API Endpoints
- `/` - Hello World
- `/health` - Health check
- `/db-test` - Database connection test
- `/auth/*` - Authentication endpoints
- `/tasks/*` - Task management endpoints  
- `/labels/*` - Label management endpoints
