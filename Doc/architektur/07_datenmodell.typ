#import "../template/hslu-template.typ": note, tip, warning, todo

= Datenmodell & Persistenz

== Entitäten & Relationen
Das Datenmodell bildet die fachlichen Kernentitäten der Anwendung ab.

#todo[Passen Sie die nachfolgende Entitäten-Tabelle an Ihr konkretes Datenbankschema an.]

#table(
  columns: (auto, auto, auto, 1fr),
  table.header([*Entität*], [*Feld*], [*Typ*], [*Beschreibung / Constraints*]),
  [User], [id], [UUID / Int], [Primary Key, automatische Generierung],
  [], [email], [String], [Unique, Pflichtfeld, validierte E-Mail-Adresse],
  [], [passwordHash], [String], [Bcrypt- / Argon2-Hash, nicht exponiert],
  [], [role], [Enum], [Rolle (`ADMIN`, `USER`)],
  [], [createdAt], [Timestamp], [Erstellungszeitpunkt],
  
  [EntityItem], [id], [UUID / Int], [Primary Key],
  [], [userId], [UUID / Int], [Foreign Key $arrow.r$ User(id)],
  [], [title], [String(255)], [Titel / Bezeichnung],
  [], [status], [Enum], [Status (`DRAFT`, `PUBLISHED`, `ARCHIVED`)],
  [], [updatedAt], [Timestamp], [Letztes Änderungsdatum],
)

== Datenmigration & Validierung
- *Schema-Migrationen:* Werden über ORM-Migrationstools (z. B. Prisma, TypeORM, Drizzle) versioniert und deterministisch ausgeführt.
- *Validierung:* Doppelte Validierung sowohl im Frontend (für unmittelbares Benutzerfeedback) als auch zwingend im Backend (via Schema-Validierung wie Zod / class-validator).
