# Draco cache reset & run cheatsheet (Windows)

## Run (from `backend/`)

```powershell
..\ .venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000 --env-file ..\.env --reload-dir .
```

**Expect:** `Connected to DB: TodoAppAZNext_dev (env=dev)`
Docs: `http://127.0.0.1:8000/docs`
Schema (fresh): `http://127.0.0.1:8000/openapi.json?bust=1`

## If Swagger looks “stuck”

```powershell
# A) kill stragglers + clear caches
Get-Process python,uvicorn -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\backend\app\__pycache__, .\backend\app\routes\__pycache__, .\backend\app\schemas\__pycache__ -ErrorAction SilentlyContinue

# B) restart clean
..\ .venv\Scripts\Activate.ps1
# from anywhere
python -m uvicorn app.main:app `
  --app-dir "C:\Dev\TodoAppAZNext\backend" `
  --reload --port 8000


# C) still unsure? switch port once
# from anywhere
python -m uvicorn app.main:app `
  --app-dir "C:\Dev\TodoAppAZNext\backend" `
  --reload --port 8001

```

## Prove routes are mounted

Add temporarily in `app/main.py` **after** router includes:

```python
for r in app.routes:
    try: print("ROUTE:", r.path, getattr(r, "methods", None))
    except: pass
```

## Dotenv sanity

`.env` (repo root) should include:

```
APP_ENV=dev
MONGO_URI=your-mongodb-connection-string
MONGO_DB_NAME_DEV=TodoAppAZNext_dev
MONGO_DB_NAME_TEST=TodoAppAZNext_test
MONGO_DB_NAME_PROD=TodoAppAZNext
ALLOW_PROD=0
```

If you see “MONGO_URI not set”, keep `--env-file ..\.env` on the run command.

## 60-second smoke tests

```powershell
irm http://127.0.0.1:8000/health
irm http://127.0.0.1:8000/db-test

# login (after signup)
$body = @{ email="test@example.com"; password="CorrectHorse1!" } | ConvertTo-Json
irm http://127.0.0.1:8000/auth/login -Method POST -ContentType "application/json" -Body $body
```

## Windows console gotcha

Avoid emojis in Python prints (CP1252). Use plain ASCII.

