# HSLU_WEBLAB – Tourenverwaltung & 3x3 Sicherheitsmatrix

Webapplikation für das Modul **WebLab** an der Hochschule Luzern (Departement Informatik).  
Entwickelt zur sicheren Organisation und rechtlichen Absicherung von alpinen Berg- und Skitouren gemäss 3x3-Sicherheitsmatrix.

---

## 🚀 Schnellstart (Entwicklung)

### 1. Backend starten (NestJS / TypeScript & MongoDB)
```bash
# Optional: MongoDB via Docker starten falls nicht lokal vorhanden
docker compose up mongo -d

cd backend
npm install
npm run start:dev
```
Das Backend läuft standardmässig unter `http://localhost:3000` (oder Port `4566` im Container) mit globalem Präfix `/api`.
REST-Endpunkte können direkt mit der Datei [backend/HSLU-Weblab.api.http](file:///home/vrx/github/HSLU_WEBLAB/backend/HSLU-Weblab.api.http) getestet werden.

### 2. Frontend starten (Angular Standalone)
```bash
cd frontend
npm install
npm start
```
Die Angular-Applikation läuft unter `http://localhost:4200/`. API-Anfragen an `/api` werden über den Entwicklungsproxy an das Backend weitergeleitet.

---

## 🐳 Containerized Setup (Docker Compose)
Aus dem Root-Verzeichnis des Repositories:

```bash
docker compose up --build
```

- **Frontend (Nginx)**: [http://localhost/](http://localhost/)
- **Backend API**: [http://localhost:4566/api](http://localhost:4566/api)
- **Mongo Express**: [http://localhost:8081/](http://localhost:8081/)

---

## 🧪 Tests ausführen

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### Backend Unit & E2E Tests
```bash
cd backend
npm run test
npm run test:e2e
```

---

## 📁 Architektur & Komponentenstruktur

Das Projekt folgt einer sauberen **Smart Container / Dumb Component**-Architektur:

- `src/app/components/`: Wiederverwendbare Basiskomponenten ([Button](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/button/button.ts), [Card](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/card/card.ts), [Badge](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/badge/badge.ts), [LoadingSpinner](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/loading-spinner/loading-spinner.ts), [InputFieldError](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/input-field-error/input-field-error.ts), [Navigation](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/components/navigation/navigation.ts))
- `src/app/pipes/`: Wiederverwendbare Pipes ([ShortenerPipe](file:///home/vrx/github/HSLU_WEBLAB/frontend/src/app/pipes/shortener-pipe.ts))
- `src/app/features/`:
  - `tour-management/`: Tourenübersicht und Tourendetails
  - `tour-editor/`: Strukturierte Tourenplanung und Formulare
  - `user/`: Personendetails und Notfallkontakte
  - `auth/`: Login und Authentifizierung
- `backend/`: NestJS-Backend mit MongoDB/Mongoose, modular aufgeteilt in `users`, `tours` und `auth`.

---

## 📚 Projektdokumentation (mit `make all` kompilierbar)

- [Projektbeschreibung](Doc/projektbeschreibung.pdf)
- [Architekturdokumentation](Doc/architektur.pdf)
- [Fazit & Reflexion](Doc/fazit_reflexion.pdf)
- [Arbeitsjournal](Doc/arbeitsjournal.pdf)
