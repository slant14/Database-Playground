# User Acceptance Tests (UAT)

---

## ``Old`` 

---

## Feature: Query Processing 
 
**User Stories:**  
> As a **user** I want to type my requests at the platform so I do
not need to install additional software.  

**Acceptance Criteria (AC):**
**Given**  The user (student or developer) needs to execute some query on the remote DB
**When** The user send the query
**Then** The query is processed on the remote DB and result is shown*

**User test:**  
1. Click **Templates** in main page
2. Click **Create Template** on templates page  
3. On code runner page choose “Chroma” from DB dropdown.  
4. Enter: `CREATE 404;`  
5. Click **Run** → Verify that data appears in results table.  
6. Enter invalid Vector-based (e.g. `CRT 22`) → Click **Run** → Verify syntax error message.  

---

## Feature:  

**User Stories:**  
> As a **user** I want to see header and first several lines of created
database so I can see what I created  

**Acceptance Criteria (AC):**
**Given**  The user (student or developer) needs to execute some query on the remote DB
**When** The user send the query
**Then** The query is processed on the remote DB and the changed (current) DB state is shown*

**User test:**  
1. Click **Templates** in main page
2. Click **Create Template** on templates page  
3. On code runner page choose “PostgeSQL” from DB dropdown.  
4. Enter: `CREATE TABLE employees (employee_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, position VARCHAR(50) NOT NULL, department VARCHAR(50), email VARCHAR(100) UNIQUE, phone VARCHAR(20), hire_date DATE, status VARCHAR(20) DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`  
5. Click **Run** → Verify that new table appears in **choose table** and **table scheme** planes.
6. Click on **users** DB in **choose table** plane → Verify that data changed
---

## Feature: Multiple Databases Support  

**User Stories:**  
> As a **user** I want to choose a type of database to create so it
suits my preferences 

**Acceptance Criteria (AC):**
**Given** The user needs to work with different databases  
**When** The user send the queries
**Then** The user can choose one of several DBs (Chroma, PostgreSQL)

**User Test:**  
1. On Code Runner page (*see the Query Processing test*), open the DB dropdown → see “PostgreSQL”, “Chroma”.  
2. Select “Chroma” → enter a sample query → click **Run** → results show.  
3. Change to “PostgreSQL” → confirm results pane clears and runs new query.

---

## ``New`` 

---

## Feature: User Registration  
**User Story:**  
> As a **user** I want to register on the platform so I can save my
projects and see statistics

**Acceptance Criteria (AC):**    
**Given** Entering into the service  
**When** The user comes to service first time and fill out the login data 
**Then** The registration is processed

**User Test:**  
1. From main page, click **Sign In** → in modal, click **Register**.  
2. Enter Name: “testuser123”, Email: “test@example.com”, Password: “P@ssw0rd”, Confirm: “P@ssw0rd”.  
3. Submit → verify redirection to Profile shows “testuser123”.  
4. Log out → back on main page, attempt sign‑in with same credentials → should succeed.  
5. Admin check: log into Django admin (`http://89.169.178.180:8000/admin` with admin/admin) → Users list contains “testuser123”.

---

## Feature: Classroom Membership & Management  
**User Stories:**  
> As a **primary instructor** I want to be able to create classrooms
and add students so I can manage the class workflow

**Acceptance Criteria (AC):** 
**Given** The user needs to learn the course
**When** The user goes to courses space 
**Then** The user can become a member of a course (classroom)

**User Test:**  
1. Log into admin at `http://89.169.178.180:8000/admin` (with admin/admin).
2. Go to **Users** → *Add User**
3. Fill name (test), password (123456), email (test@email.com), ect. (remember the name and password for first user)
4. Create several more users (using 2-3 steps) for TA and primary instructor
5. Go to `http://89.169.178.180:3000`
6. Click **Sign In** → enter **name** “test”, **password** “123456”
7. Click **Classrooms** → click **Add Classroom** button → enter the title “Biology 101”, select the **TA**, **primary_instructor** (add yourself), **students** → click **Save** button
8. The created class will appear on Classroom page

---
