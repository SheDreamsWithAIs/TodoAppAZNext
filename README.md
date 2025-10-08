What are we doing here

Project structure

How to get the app up and running

* [ ] `cd C:\Dev\TodoAppAZNext\backend`
* [ ] `..\.venv\Scripts\Activate.ps1` or `C:\Dev\TodoAppAZNext\.venv\Scripts\Activate.ps1`
* [ ] `.env present` (backend or repo root) with `MONGO_URI=...`
* [ ] `C:\Python313\python.exe -m uvicorn app.main:app --reload --port 8000` or `$env:PYTHONPATH = "C:\Dev\TodoAppAZNext\backend"; python -m uvicorn app.main:app --reload --port 8000`
* [ ] Check `http://127.0.0.1:8000/health` → `{status: healthy}`

Here be dragons 
🐉🐉🐉