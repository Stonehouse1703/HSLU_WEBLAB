#import "../template/hslu-template.typ": note, tip, warning, todo

= Querschnittskonzepte

== Sicherheitskonzept (Security)
- *Authentifizierung & Autorisierung:* Token-basierte Authentifizierung (JWT) mit angemessener Expiration Time und Role-Based Access Control (RBAC).
- *Schutz gegen gängige Web-Schwachstellen (OWASP Top 10):*
  - *XSS:* Automatisches Escaping durch das Frontend-Framework, Content Security Policy (CSP).
  - *CSRF:* SameSite-Cookie-Flags und CSRF-Tokens für zustandsbehaftete Mutationen.
  - *SQL-Injection:* Ausschliessliche Verwendung von parametrierten Queries über ORM / Query Builder.
- *HTTPS & Verschlüsselung:* Durchgehende TLS-Verschlüsselung im Transit, Passwort-Hashing mit Argon2id / Bcrypt.

== Fehlerbehandlung & Logging
- *Frontend:* Globaler Error-Boundary-Handler, benutzerfreundliche Toast-Nachrichten, Graceful Degradation bei Verbindungsunterbrüchen.
- *Backend:* Zentraler Exception-Filter / Middleware, strukturierte JSON-Logs (z. B. Pino / Winston) mit Request-IDs zur Nachverfolgbarkeit.
- *API-Fehlerformat:* Standardisierte RFC 7807 (Problem Details for HTTP APIs) Fehlerrückgaben:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validierungsfehler im Feld 'email'",
  "timestamp": "2026-03-01T10:00:00.000Z"
}
```

== UI/UX & Responsive Design
- Mobile-First-Ansatz mit Breakpoints für Mobile ($< 640"px"$), Tablet ($640 - 1024"px"$) und Desktop ($> 1024"px"$).
- Barrierefreiheit (a11y) gemäss WCAG 2.1 AA Kriterien (Farbkontraste, Tastaturbedienbarkeit, ARIA-Labels).
