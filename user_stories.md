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