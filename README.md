# Paper Bank

A web application that helps students by providing a searchable bank of previous year question papers. It includes a Java-based backend (SpringBoot) and a JavaScript (NextJS) frontend (SPA) with features for authentication, paper upload/storage, admin operations, and AI-powered helpers.

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Repository structure](#repository-structure)
- [How to run (development)](#how-to-run-development)
- [Configuration / environment variables](#configuration--environment-variables)
- [API surface (overview)](#api-surface-overview)
- [Development notes](#development-notes)
- [Contributing](#contributing)

---

## Features
- User authentication (signup / login)
- Upload, download and list question papers
- Admin endpoints for management
- Basic AI utilities (e.g., summarization / helper endpoints) backed by a pluggable AI service
- File storage service for handling uploaded assets

---

## Tech stack
- Languages: Java (backend), JavaScript, NextJS (frontend), CSS
- Backend: Spring Boot (Maven)
- Frontend: JavaScript, NextJS (typical npm / create-react-app or similar)
- Notable modules (based on repository layout):
  - Controllers: AuthController, PaperController, AdminController, AIController
  - Services: AuthService, PaperService, FileStorageService, GeminiService (AI integration)

---

## Repository structure
Top-level:
```
backend/     # Java Spring application (Maven)
frontend/    # JavaScript single-page app
```

backend (important paths)
```
backend/pom.xml
backend/src/main/java/com/paperbank/
  PaperBankApplication.java
  controller/      # REST controllers (AuthController, PaperController, AdminController, AIController)
  service/         # Business logic (AuthService, PaperService, FileStorageService, GeminiService)
  repository/      # Persistence interfaces
  model/           # Domain models / DTOs
  config/, security/, exception/ ...
backend/src/main/resources/
  application.properties (app configuration)
```

frontend (typical SPA)
```
frontend/         # frontend source, package.json, build scripts
```

How it fits together:
- The frontend is a single-page app that talks to the backend's REST API.
- The backend exposes authentication, paper management, admin and AI endpoints. Paper uploads are stored using a file storage service (local or cloud based, configurable).

---

## How to run (development)

Prerequisites:
- Java 11+ (or the version used by the project)
- Maven
- Node.js + npm (or yarn)
- NextJS
- Git

Backend (from repository root):
```bash
# move into backend
cd backend

# run via Maven (development)
mvn spring-boot:run

# OR build and run the packaged jar
mvn clean package
java -jar target/*.jar
```

Frontend (from repository root):
```bash
cd frontend

# install dependencies
npm install

# start dev server (often runs on http://localhost:3000)
npm start

# build for production
npm run build
```

After both are running, open the frontend in the browser (commonly http://localhost:3000). The frontend should be configured to call the backend API (commonly http://localhost:8080) — see configuration below.

---

## Configuration / environment variables

Edit backend/src/main/resources/application.properties (or provide environment variables) for:
- Server port (if you need to change default): server.port
- Database connection (JDBC URL / datasource), example keys:
  - spring.datasource.url
  - spring.datasource.username
  - spring.datasource.password
- JWT / auth secret: a config key such as jwt.secret or equivalent used by AuthService
- File storage path: FILE_STORAGE_PATH or a configurable storage location used by FileStorageService
- AI / external API keys: keys used by GeminiService (e.g., GEMINI_API_KEY or other provider token)

Edit frontend environment for:
- API base URL (e.g., REACT_APP_API_URL or similar) so the SPA can call backend endpoints.

Note: The exact property names are kept in the project's application.properties and the frontend .env (search those files to confirm exact variable names).

---

## API surface (high-level)
The backend exposes REST endpoints grouped by controller:
- AuthController: signup, login, token refresh
- PaperController: upload paper, list papers, download, search
- AdminController: admin-only operations (manage users/papers)
- AIController: AI-related endpoints (summaries, Q/A, or generation) backed by GeminiService

For concrete endpoint paths and payloads, inspect the controller classes in:
`backend/src/main/java/com/paperbank/controller/`

Example (generic) cURL for login and listing papers:
```bash
# Login (example)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password"}'

# List papers (example)
curl http://localhost:8080/api/papers \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Development notes
- The backend uses Maven (pom.xml) for dependency management and build.
- Place uploaded files in the configured file storage path. The FileStorageService centralizes this behavior.
- The project contains an AI integration component (GeminiService). That service expects credentials for an external AI API; keep secrets out of source control and supply them via environment variables.
- If you add DB migrations or schema changes, document them and update any start scripts.

---

## Contributing
1. Fork the repo and create a feature branch.
2. Run the backend and frontend locally and add tests where appropriate.
3. Submit a pull request describing the change and any setup steps.

Please follow the code style already present (Java conventions for backend, JS conventions for frontend).

---

## Troubleshooting
- Backend fails to start: check `application.properties` for missing DB or storage configuration.
- 401/403 from API: ensure JWT secret and authentication flow are configured and the frontend sends the Authorization header.
- AI endpoints error: confirm AI provider API key is set and has sufficient quota.

---

- Draft a minimal LICENSE file (MIT / Apache 2.0) and add it to the repo.
- Create a CONTRIBUTING.md with a PR checklist and development steps.
- Generate sample .env and application.properties templates with the likely keys used by the code.
