# Project Notes

## Context

## 2) Documents (MongoDB)

* **User**: `_id`, `email`, `password_hash`, `name?`, `created_at`
* **Label**: `_id`, `user_id`, `name`, `color?`, `created_at`
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
