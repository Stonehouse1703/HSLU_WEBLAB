import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <main class="home-page">
      <section class="intro" aria-labelledby="home-title">
        <div class="intro-copy">
          <span class="eyebrow">Tourenverwaltung</span>
          <h1 id="home-title">Alles Wichtige für deine nächste Tour.</h1>
          <p>
            Plane gemeinsame Erlebnisse, behalte den Überblick über deine Touren
            und finde die wichtigsten Personendaten an einem Ort.
          </p>
          <a class="primary-action" routerLink="/tour-management">
            <span class="material-icons" aria-hidden="true">hiking</span>
            Touren ansehen
          </a>
        </div>

        <div class="intro-mark" aria-hidden="true">
          <span class="material-icons">explore</span>
          <span class="mark-label">bereit für draussen</span>
        </div>
      </section>

      <section class="capabilities" aria-labelledby="capabilities-title">
        <div class="section-heading">
          <span class="eyebrow">Dein Überblick</span>
          <h2 id="capabilities-title">Was du hier erledigen kannst</h2>
        </div>

        <div class="feature-grid">
          <article class="feature-card feature-card--accent">
            <span class="feature-icon material-icons" aria-hidden="true">route</span>
            <div>
              <h3>Touren organisieren</h3>
              <p>Alle geplanten Touren mit Datum, Treffpunkt, Zeit und Schwierigkeit auf einen Blick.</p>
              <a routerLink="/tour-management">Zu den Touren <span aria-hidden="true">→</span></a>
            </div>
          </article>

          <article class="feature-card">
            <span class="feature-icon material-icons" aria-hidden="true">groups</span>
            <div>
              <h3>Personen im Blick behalten</h3>
              <p>Teilnehmende und Tourleitungen sind direkt der passenden Tour zugeordnet.</p>
              <a routerLink="/tour-management">Teilnehmende ansehen <span aria-hidden="true">→</span></a>
            </div>
          </article>

          <article class="feature-card">
            <span class="feature-icon material-icons" aria-hidden="true">contact_emergency</span>
            <div>
              <h3>Im Notfall vorbereitet sein</h3>
              <p>Wichtige Kontaktdaten sind für berechtigte Tourleitungen schnell erreichbar.</p>
              <span class="feature-note">Nur für Tourleitungen</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .home-page {
      display: grid;
      gap: 4rem;
      padding: 1rem 0 3rem;
    }

    .intro {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(13rem, 0.6fr);
      align-items: center;
      gap: 2rem;
      min-height: 21rem;
      padding: clamp(2rem, 5vw, 4.5rem);
      border-radius: 20px;
      color: #fff;
      background: #253c38;
      overflow: hidden;
    }

    .intro-copy {
      max-width: 42rem;
    }

    .eyebrow {
      display: block;
      margin-bottom: 0.65rem;
      color: #e4b86a;
      font-size: 0.76rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1,
    h2,
    h3,
    p {
      margin-top: 0;
    }

    h1 {
      max-width: 12ch;
      margin-bottom: 1rem;
      font-size: clamp(2.2rem, 5vw, 4.5rem);
      font-weight: 500;
      line-height: 1.04;
    }

    .intro p {
      max-width: 35rem;
      margin-bottom: 1.75rem;
      color: #d6e0d9;
      line-height: 1.7;
    }

    .primary-action,
    .secondary-action {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
    }

    .primary-action {
      padding: 0.8rem 1.1rem;
      color: #253c38;
      background: #e4b86a;
    }

    .primary-action:hover,
    .secondary-action:hover {
      filter: brightness(1.06);
    }

    .intro-mark {
      display: grid;
      justify-items: center;
      gap: 0.75rem;
      color: #e4b86a;
    }

    .intro-mark .material-icons {
      font-size: clamp(7rem, 15vw, 12rem);
      opacity: 0.9;
    }

    .mark-label {
      color: #d6e0d9;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .capabilities {
      display: grid;
      gap: 1.5rem;
    }

    .section-heading h2 {
      margin-bottom: 0;
      color: #253c38;
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      font-weight: 500;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 1rem;
    }

    .feature-card {
      display: grid;
      align-content: start;
      gap: 1.25rem;
      min-height: 15rem;
      padding: 1.5rem;
      border: 1px solid #d9ded8;
      border-radius: 12px;
      background: #fff;
    }

    .feature-card--accent {
      border-color: #e4b86a;
      background: #fffaf0;
    }

    .feature-icon {
      color: #4f7468;
      font-size: 2rem;
    }

    .feature-card h3 {
      margin-bottom: 0.6rem;
      color: #253c38;
      font-size: 1.15rem;
      font-weight: 600;
    }

    .feature-card p {
      min-height: 4.5rem;
      margin-bottom: 1rem;
      color: #626b67;
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .feature-card a {
      color: #41685c;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
    }

    .feature-card a span {
      margin-left: 0.25rem;
    }

    .feature-note {
      color: #8b6c2d;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .next-step {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding: 1.5rem 1.75rem;
      border-top: 1px solid #d9ded8;
      border-bottom: 1px solid #d9ded8;
    }

    .next-step > div {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .next-step > div > .material-icons {
      color: #c08b30;
      font-size: 2rem;
    }

    .next-step h2 {
      margin-bottom: 0.35rem;
      color: #253c38;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .next-step p {
      margin-bottom: 0;
      color: #626b67;
      font-size: 0.9rem;
    }

    .secondary-action {
      flex-shrink: 0;
      padding: 0.75rem 1rem;
      color: #fff;
      background: #41685c;
    }

    @media (max-width: 800px) {
      .intro {
        grid-template-columns: 1fr;
      }

      .intro-mark {
        display: none;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 560px) {
      .home-page {
        gap: 2.5rem;
      }

      .intro {
        border-radius: 12px;
      }

      .next-step {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
