# SahaYatri – Lost & Found People & Items Platform

SahaYatri is a **full‑stack intelligent Lost & Found system** designed to help reunite missing people and items with their families/owners using:

* Smart form‑based reporting
* Photo‑based AI matching
* CCTV/Webcam live detection
* SMS notifications
* Volunteer & admin workflow
* Offline maps for search convenience

---

##  Features

###  User Roles

* **User** – can submit lost/found person or item reports.
* **Volunteer** – approved by admin, helps verify & track reported cases.
* **Admin** – manages users, approvals, matches, and system data.

---

##  Core Functionalities

### 1.  Lost & Found Reporting

Users can submit:

* Lost Person
* Found Person
* Lost Item
* Found Item

Each report supports:

* Photo upload (Cloudinary)
* Voice recording upload
* Age, gender, medical conditions
* Location, time, description

### 2.  AI-Based Photo Matching

* Uses **Face++ API** for form‑to‑form image matching (Lost Person ↔ Found Person)
* Matches items using visual similarity
* Matches stored in **match_person** and **match_item** tables
* Automatic SMS to families using **Twilio** API

### 3.  CCTV / Webcam Detection

* Python + OpenCV + DeepFace
* As soon as a lost person stands in front of webcam:

  * Face encodings are checked against database (PostgreSQL)
  * On match → SMS alert via Twilio

### 4.  Offline Map Integration

* Map available without internet
* User can mark last seen location or found location

### 5.  Admin Panel Features

* Approve volunteer/user accounts
* Change user roles
* Delete users
* View all reports
* View all match history (persons + items combined)

### 6.  Cloud Storage (Cloudinary)

All images and recordings stored as URLs.

---

##  Project Structure

```
SahaYatri
│
├── CCTV-Detection        # Python AI webcam detection
├── SahaYatri-Backend     # Spring Boot REST API
└── SahaYatri-Frontend    # React Frontend (Vite)
```

---

##  Tech Stack

### Frontend

* React + Vite
* Tailwind CSS
* Axios
* React Router
* Offline Maps

### Backend (Spring Boot)

* Java Spring Boot
* Spring Security + JWT Auth
* PostgreSQL
* JPA/Hibernate
* External APIs:

  * Twilio (SMS)
  * Face++ (photo matching)
  * Cloudinary (image storage)

### AI / Detection

* Python
* OpenCV
* DeepFace
* NumPy

---

##  Database Tables

### People

* `lost_person`
* `found_person`
* `match_person`

### Items

* `lost_item`
* `found_item`
* `match_item`

### Users

* `users` (roles: USER, VOLUNTEER, ADMIN)

---

##  Running the Project

### 1.  Backend (Spring Boot)

```bash
cd SahaYatri-Backend
mvn spring-boot:run
```

Default URL: `http://localhost:8080`

### 2.  Frontend (React)

```bash
cd SahaYatri-Frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

### 3.  CCTV / Webcam Detection

```bash
cd CCTV-Detection
python face_match.py "<webcam_path>" "<cloudinary_image_urls>"
```

---

##  Authentication

* JWT-based login
* Admin-only endpoints protected with role validation

---

##  Important APIs Used

###  Twilio – SMS Alerts

* Sends SMS to families when a match is detected

###  Cloudinary – Media Storage

* Stores image URLs + voice recording URLs

###  Face++ – Face Matching

* Deep-learning based comparison for lost/found persons

---

##  Key Endpoints

###  Admin Endpoints

* `/api/admin/users` – get all users
* `/api/admin/approve/{id}` – approve user
* `/api/admin/role/{id}` – change role
* `/api/admin/user/{id}` – delete user

###  Reporting

* `/api/reports/lost` – submit lost person
* `/api/reports/found` – submit found person
* `/api/reports/match-lost-person` – webcam matching

###  Matches

* `/api/matches/people`
* `/api/matches/items`

---

##  Automated Matching Flow

1. User submits lost/found report
2. Backend checks against existing opposite reports
3. If similar → match saved in DB
4. SMS sent via Twilio

---

##  Future Enhancements

* Mobile App version
* Advanced AI embeddings, vector DB
* Real CCTV integration
* Heatmap-based search assistance


