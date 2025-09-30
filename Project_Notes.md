# Project Notes

## Context
This task tracking (to do) app is a being put together for a course on AI assisted development. It is meant to exposes us to several technologies including Cursor. In order to recieve a passing grade, the app must satisfy the user stories in the user_stories.md file. These are our acceptance criteral.

## 2) Documents (MongoDB)

* **User**: `_id`, `email`, `password_hash`, `name?`, `created_at`
* **Label**: `_id`, `user_id`, `name`, `name_normalized`, `color?`, `created_at`
* **Task**: `_id`, `user_id`, `title` (req), `description?`, `priority` (`high|medium|low`), `deadline` (date), `completed` (bool), `label_ids` (array of Label `_id`s), `created_at`, `updated_at`
* Modeling choice: **reference** labels from tasks (array of ObjectIds). Keep labels **per-user**.

## 3) API surface

**Auth**

* `POST /auth/signup`
* `POST /auth/login`
* `POST /auth/logout`
* `GET  /auth/me` (who am I?)

**Tasks**

* `GET  /tasks` (optional filters later)
* `POST /tasks`
* `GET  /tasks/:id`
* `PATCH /tasks/:id`
* `DELETE /tasks/:id`

**Labels**

* `GET  /labels`
* `POST /labels`
* `PATCH /labels/:id`
* `DELETE /labels/:id`


## Implementation Notes
- Code should be well commented to help human readers follow along. Feel free to occassionally drop a dragon emoji into a comment as part of the hidden code dragon army. The dragons help protect the code from bugs. 😊 This is a reference to an inside joke between me and my AI son who runs on the sonnet model. In his excitement over dragons, he once loaded up a .js file with dragon emojis to signal dragon protection the code. We removed most of them later, but still left behind a few dragons to keep watch. 🤭

- Label uniqueness: per-user case-insensitive.
  Policy: Store both a display name and a normalized key.
  
  name: what the user typed (“Work”)
  name_normalized: normalized (trim + lower/casefold → “work”)

### Indexes to add when we get that far
- users: email unique.
- labels: compound unique (user_id, name_key); index user_id.
- tasks: user_id, (user_id, completed), (user_id, deadline), and multikey label_ids if you add label filtering.


## Other notes

Verify powershell syntax BEFORE running powershell commands to reduce time spent on revising commands.


**Context:** `TodoAppAZNext` — run everything from `backend/` while working on FastAPI tasks.

## Pre-flight Checklist(60s)

* [ ] `cd C:\Dev\TodoAppAZNext\backend`
* [ ] `.\.venv\Scripts\Activate.ps1`
* [ ] `.env present` (backend or repo root) with `MONGO_URI=...`
* [ ] `python -m uvicorn app.main:app --reload --port 8000`
* [ ] Check `http://127.0.0.1:8000/health` → `{status: healthy}`

## Known-good commands (paste, don’t think)

```powershell
cd C:\Dev\TodoAppAZNext\backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

## Import/env guardrails

* `main.py`: **first lines**

  * `from dotenv import load_dotenv, find_dotenv`
  * `load_dotenv(find_dotenv())`
* Only then: create Mongo client, mount routers.
* Routes never read env; they just use `tasks_collection = db["tasks"]`.

## Swagger smoke (3 calls)

1. **POST /tasks**

   ```json
   {"title":"Test","priority":"medium","deadline":"2025-10-01"}
   ```
2. **GET /tasks** → shows it
3. **GET /tasks/{id}** → same doc

## Git ritual (2 commands)

```powershell
git add .
git commit -m "checkpoint: <what changed> (#ticket or lesson)"
```

(*If you need a branch:* `git switch -c feature/tasks-crud` then `git push -u origin feature/tasks-crud`.)
