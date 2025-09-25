# Project Notes

## Context

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