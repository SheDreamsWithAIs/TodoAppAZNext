# User Stories - Acceptance Criteria

## Required Features (Core User Stories)
These are the essential features that must be completed for a passing grade.

* **User Management**
    * **As a user, I want to sign up for an account**, so I can have my own personal task list.
    * **As a user, I want to log in**, so I can access my tasks and manage my profile.
    * **As a user, I want to securely log out**, so my data is protected from others.
* **Task Management**
    * **As a user, I want to create a new task**, so I can add things I need to do to my list.
    * **As a user, I want to view all my tasks**, so I can see everything I need to get done.
    * **As a user, I want to update a task's details**, so I can change its title, description, or status (e.g., incomplete to complete).
    * **As a user, I want to delete a task**, so I can remove completed or irrelevant items from my list.
    * **Required Task Fields**: Every task must include a **title**, an optional **description**, a **priority** level (e.g., High, Medium, Low), and a **deadline** (date).
* **Labeling System**
    * **As a user, I want to create and manage labels (e.g., 'Work,' 'Personal,' 'Urgent')**, so I can categorize and/or prioritize my tasks.
    * **As a user, I want to assign one or more labels to a task**, so I can easily filter and organize my tasks.
* **Data Persistence**
    * The application must **persist all user, task, and label data in a MongoDB database**.


## More explicit Aceptance Criteria:

- Auth: can sign up, log in (httpOnly cookie), log out, and GET /auth/me returns current user.
- Tasks: can create/view/update/delete my own tasks; title required; priority + deadline present; completed toggles.
-  Labels: can create/manage labels; name unique per user case-insensitively; can assign multiple labels to a task.
- Persistence & scope: data stored in MongoDB and scoped to the logged-in user.
- Readiness: /health returns 200 when API up.

### Auth:
- Auth: can sign up, log in (httpOnly cookie), log out, and GET /auth/me returns current user.
- Signup success: given new email, returns 201 + sets cookie + me works
- Signup duplicate: same email → 409 (or 400) with friendly message
- Login success: valid creds → 200 + sets cookie + me works
- Login fail: bad creds → 401, no cookie
- Logout: clears cookie; subsequent me → 401
- Me unauth: no cookie → 401