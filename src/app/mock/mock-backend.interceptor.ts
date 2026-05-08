import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  MOCK_ANWESEND_PERSONEN,
  MOCK_FREIGABE_POSITIONEN,
  MOCK_FREIGABE_POSITIONEN_HISTORY,
  MOCK_LK_DETAILS,
  MOCK_LOGGED_IN_PERSON,
  MOCK_MUSS_PDF_LESEN,
  MOCK_ORGANISATIONSEINHEITEN,
  MOCK_PERSONEN,
  MOCK_PRODUKTE,
  MOCK_STEMPELZEITEN,
  MOCK_TAETIGKEITSBUCHUNGEN,
  MOCK_TRIGGER,
  MOCK_VERTRAEGE,
  MOCK_ABSCHLUSS_INFO,
  MOCK_FEIERTAGE,
  MOCK_PERSONENVERMERKE,
  MOCK_PERSON_HISTORY,
} from './mock-data';

/**
 * Intercepts outgoing HTTP requests and serves mock responses in place of a
 * real backend. This is activated via `environment.useMockBackend = true`.
 *
 * The interceptor must run BEFORE the `ProxyInterceptor` so that matching is
 * done on the relative endpoint string (e.g. `personen`, `stempelzeiten/42`)
 * rather than on the fully-qualified URL.
 */
@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Only activate when explicitly enabled.
    if (!(environment as any).useMockBackend) {
      return next.handle(req);
    }

    // Let local assets and proxy-config fetches through.
    if (
      req.url.startsWith('/assets') ||
      req.url.endsWith('.json') ||
      req.url.endsWith('.js') ||
      req.url.endsWith('.css') ||
      req.url.endsWith('.ico')
    ) {
      return next.handle(req);
    }

    const endpoint = this.extractEndpoint(req.url);
    const body = this.handle(endpoint, req.method, req.body);

    if (body === undefined) {
      // No mock matched — fall through so the real interceptor chain runs.
      return next.handle(req);
    }

    // Simulate a small network delay so loading states are visible.
    return of(
      new HttpResponse({
        status: 200,
        body,
        url: req.url,
      })
    ).pipe(delay(150));
  }

  /**
   * Strips any leading scheme/origin/proxy prefix so we are left with the
   * relative backend endpoint (e.g. `personen/42` or `stempelzeiten`).
   */
  private extractEndpoint(url: string): string {
    let endpoint = url;

    // If the URL has already been rewritten by ProxyInterceptor we still
    // want to isolate the final segment after `/proxy/v1/` or `/srv/v1/`.
    const match = endpoint.match(/\/(?:srv|proxy)\/v1\/(.*)$/);
    if (match) {
      endpoint = match[1];
    }

    // Strip any leading slash and an `api/` prefix if present.
    endpoint = endpoint.replace(/^\/+/, '').replace(/^api\//, '');

    // Drop query string so route matching stays simple.
    const qIdx = endpoint.indexOf('?');
    if (qIdx !== -1) {
      endpoint = endpoint.substring(0, qIdx);
    }

    return endpoint;
  }

  /**
   * Returns mock response body for a given endpoint/method, or `undefined`
   * to indicate "no mock — pass through".
   */
  private handle(endpoint: string, method: string, body: unknown): unknown {
    const m = method.toUpperCase();

    // ── infopdf ───────────────────────────────────────────────────────────
    if (endpoint === 'infopdf/musslesen' && m === 'GET') {
      return MOCK_MUSS_PDF_LESEN;
    }
    if (endpoint === 'infopdf/hatgelesen' && m === 'POST') {
      return null;
    }

    // ── personen ─────────────────────────────────────────────────────────
    if (endpoint === 'personen:anwesend' && m === 'GET') {
      return MOCK_ANWESEND_PERSONEN;
    }
    if (endpoint === 'personen' && m === 'GET') {
      return MOCK_PERSONEN;
    }
    if (endpoint === 'personen' && m === 'POST') {
      const created = { ...(body as any), id: `p-${Date.now()}`, version: 1 };
      return created;
    }

    const personMatch = endpoint.match(/^personen\/([^/]+)$/);
    if (personMatch) {
      const id = personMatch[1];
      if (m === 'GET') {
        if (id === 'me') return MOCK_LOGGED_IN_PERSON;
        return MOCK_PERSONEN.find((p) => p.id === id) ?? MOCK_PERSONEN[0];
      }
      if (m === 'POST') {
        return { ...(body as any), id, version: 2 };
      }
    }

    if (endpoint.match(/^personen\/[^/]+\/reset$/) && m === 'POST') {
      return MOCK_LOGGED_IN_PERSON;
    }
    if (endpoint.match(/^personen\/[^/]+\/disable$/) && m === 'POST') {
      return MOCK_LOGGED_IN_PERSON;
    }
    if (endpoint.match(/^personen\/[^/]+\/produkte$/) && m === 'GET') {
      return MOCK_PRODUKTE;
    }
    const stempelzeitenByPersonMatch = endpoint.match(/^personen\/([^/]+)\/stempelzeiten$/);
    if (stempelzeitenByPersonMatch && m === 'GET') {
      const pid = stempelzeitenByPersonMatch[1];
      return MOCK_STEMPELZEITEN.filter(s => s.person?.id === pid);
    }
    if (endpoint.match(/^personen\/[^/]+\/abwesenheiten$/) && m === 'GET') {
      return MOCK_STEMPELZEITEN.filter(
        (s) => s.zeitTyp === 'Urlaub' || s.zeitTyp === 'Krankenstand'
      );
    }
    if (endpoint.match(/^personen\/[^/]+\/teamleiter$/) && m === 'GET') {
      return [MOCK_PERSONEN[0]];
    }
    if (endpoint.match(/^personen\/[^/]+\/abschluss\/info$/) && m === 'GET') {
      return MOCK_ABSCHLUSS_INFO;
    }
    if (endpoint.match(/^personen\/[^/]+\/abschluss-info$/) && m === 'GET') {
      return MOCK_ABSCHLUSS_INFO;
    }
    if (endpoint.match(/^personen\/[^/]+\/personenvermerke$/) && m === 'GET') {
      return MOCK_PERSONENVERMERKE;
    }
    if (endpoint.match(/^personen\/[^/]+\/historyAuswertung$/) && m === 'GET') {
      return MOCK_PERSON_HISTORY;
    }

    // ── stempelzeiten ────────────────────────────────────────────────────
    if (endpoint === 'stempelzeiten' && m === 'GET') {
      return MOCK_STEMPELZEITEN;
    }
    const stempelMatch = endpoint.match(/^stempelzeiten\/([^/]+)$/);
    if (stempelMatch) {
      const id = stempelMatch[1];
      if (m === 'POST') {
        return { ...(body as any), id, version: 2 };
      }
      if (m === 'GET') {
        return MOCK_STEMPELZEITEN.find((s) => s.id === id) ?? MOCK_STEMPELZEITEN[0];
      }
    }
    if (endpoint.match(/^stempelzeiten\/sendCalendar\/[^/]+$/) && m === 'POST') {
      return null;
    }

    // ── organisationseinheiten ───────────────────────────────────────────
    if (endpoint === 'organisationseinheiten' && m === 'GET') {
      return MOCK_ORGANISATIONSEINHEITEN;
    }
    if (endpoint === 'organisationseinheiten' && m === 'POST') {
      return { ...(body as any), id: `oe-${Date.now()}`, version: 1 };
    }
    const oeMatch = endpoint.match(/^organisationseinheiten\/([^/]+)$/);
    if (oeMatch && m === 'POST') {
      return { ...(body as any), id: oeMatch[1], version: 2 };
    }

    // ── verträge ─────────────────────────────────────────────────────────
    if (endpoint === 'vertraege' && m === 'GET') return MOCK_VERTRAEGE;
    if (endpoint === 'vertraege' && m === 'POST') {
      return { ...(body as any), id: `v-${Date.now()}`, version: 1 };
    }
    const vertragMatch = endpoint.match(/^vertraege\/([^/]+)$/);
    if (vertragMatch) {
      const id = vertragMatch[1];
      if (m === 'GET') {
        return MOCK_VERTRAEGE.find((v) => v.id === id) ?? MOCK_VERTRAEGE[0];
      }
      if (m === 'POST') {
        return { ...(body as any), id, version: 2 };
      }
    }
    if (endpoint === 'vertraege-vertragsverantwortlicher' && m === 'GET') {
      return MOCK_VERTRAEGE;
    }
    if (endpoint.match(/^vertraege\/[^/]+\/trigger$/) && m === 'GET') {
      return MOCK_TRIGGER;
    }
    if (endpoint.match(/^vertraege\/[^/]+\/lkdetails$/)) {
      if (m === 'GET') return MOCK_LK_DETAILS;
      if (m === 'POST') {
        return { ...(body as any), id: `lk-${Date.now()}`, version: 1 };
      }
    }
    if (endpoint.match(/^lkdetails\/[^/]+$/) && m === 'POST') {
      return { ...(body as any), version: 2 };
    }

    // ── vertrag-positionen ───────────────────────────────────────────────
    if (
      endpoint.match(/^vertraege\/[^/]+\/vertrag-positionen$/) &&
      m === 'POST'
    ) {
      return { ...(body as any), id: `vp-${Date.now()}`, version: 1 };
    }
    if (endpoint.match(/^vertrag-positionen\/[^/]+$/) && m === 'POST') {
      return { ...(body as any), version: 2 };
    }
    if (
      endpoint.match(/^vertrag-positionen\/[^/]+\/(reset|jahresuebertrag)$/) &&
      m === 'POST'
    ) {
      return { version: 2 };
    }
    if (
      endpoint.match(
        /^vertrag-positionen\/[^/]+\/vertrag-position-verbraucher$/
      ) &&
      m === 'POST'
    ) {
      return { ...(body as any), id: `vpv-${Date.now()}`, version: 1 };
    }
    if (
      endpoint.match(/^vertrag-position-verbraucher\/[^/]+$/) &&
      m === 'POST'
    ) {
      return { ...(body as any), version: 2 };
    }
    if (
      endpoint.match(/^vertrag-position-verbraucher\/[^/]+\/reset-and-copy$/) &&
      m === 'POST'
    ) {
      return { version: 2 };
    }
    if (endpoint.match(/^vertrag-position-verbraucher\/[^/]+$/) && m === 'GET') {
      return [];
    }

    // ── stundenplanung ───────────────────────────────────────────────────
    if (endpoint.match(/^stundenplanung\/[^/]+$/)) {
      if (m === 'GET') return { id: 'sp-1', version: 1, stunden: '40' };
      if (m === 'POST') return { ...(body as any), version: 2 };
    }
    if (endpoint.match(/^produkt-positionen\/[^/]+\/stundenplanung$/) && m === 'POST') {
      return { ...(body as any), id: `sp-${Date.now()}`, version: 1 };
    }

    // ── trigger ──────────────────────────────────────────────────────────
    if (endpoint.match(/^trigger\/[^/]+$/) && m === 'GET') {
      return MOCK_TRIGGER[0];
    }
    if (endpoint === 'trigger' && m === 'POST') {
      return { ...(body as any), id: `tr-${Date.now()}`, version: 1 };
    }
    if (endpoint.match(/^trigger\/[^/]+$/) && m === 'POST') {
      return { ...(body as any), version: 2 };
    }

    // ── produkte & produkt-positionen ─────────────────────────────────────
    if (endpoint === 'produkte' && m === 'GET') return MOCK_PRODUKTE;
    if (endpoint === 'produkte' && m === 'POST') {
      return { ...(body as any), id: `prod-${Date.now()}`, version: 1 };
    }
    const produktMatch = endpoint.match(/^produkte\/([^/]+)$/);
    if (produktMatch) {
      const id = produktMatch[1];
      if (m === 'GET') return MOCK_PRODUKTE.find((p) => p.id === id) ?? MOCK_PRODUKTE[0];
      if (m === 'POST') return { ...(body as any), id, version: 2 };
    }
    if (endpoint.match(/^produkte\/[^/]+\/produkt-positionen$/) && m === 'POST') {
      return { ...(body as any), id: `pp-${Date.now()}`, version: 1 };
    }
    if (endpoint.match(/^produkt-positionen\/[^/]+$/) && m === 'POST') {
      return { ...(body as any), version: 2 };
    }
    if (endpoint.match(/^produkt-positionen\/[^/]+\/reset$/) && m === 'POST') {
      return { version: 2 };
    }
    if (
      endpoint.match(/^produkt-positionen\/[^/]+\/produkt-positionen-buchungspunkte$/) &&
      m === 'POST'
    ) {
      return { ...(body as any), id: `ppbp-${Date.now()}`, version: 1 };
    }
    if (endpoint.match(/^produkt-positionen-buchungspunkte\/[^/]+$/) && m === 'POST') {
      return { ...(body as any), version: 2 };
    }
    if (
      endpoint.match(
        /^produkt-positionen-buchungspunkte\/[^/]+\/taetigkeitsbuchungen$/
      ) &&
      m === 'POST'
    ) {
      return { ...(body as any), id: `tb-${Date.now()}`, version: 1 };
    }
    const taetigkeitsbuchungMatch = endpoint.match(/^taetigkeitsbuchungen\/([^/]+)$/);
    if (taetigkeitsbuchungMatch && m === 'POST') {
      return { ...(body as any), id: taetigkeitsbuchungMatch[1], version: 2 };
    }

    // ── freigabe-positionen ──────────────────────────────────────────────
    if (endpoint === 'freigabePositionen' && m === 'GET') {
      return MOCK_FREIGABE_POSITIONEN;
    }
    if (endpoint === 'freigabePositionen/history' && m === 'GET') {
      return MOCK_FREIGABE_POSITIONEN_HISTORY;
    }
    const tbMatch = endpoint.match(/^freigabePositionen\/([^/]+)\/taetigkeitsbuchungen$/);
    if (tbMatch && m === 'GET') {
      const id = tbMatch[1];
      // Deterministically vary the detail rows per freigabe-position id so
      // selecting a different row on the left shows a different set of
      // tätigkeitsbuchungen on the right.
      let seed = 0;
      for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
      const total = MOCK_TAETIGKEITSBUCHUNGEN.length;
      const count = 3 + (seed % 8); // 3..10 rows
      const start = seed % total;
      const slice: any[] = [];
      for (let i = 0; i < count; i++) {
        const src = MOCK_TAETIGKEITSBUCHUNGEN[(start + i) % total];
        slice.push({ ...src, id: `${src.id}-${id}` });
      }
      return slice;
    }

    // ── feiertage ────────────────────────────────────────────────────────
    if (endpoint === 'feiertage' && m === 'GET') return MOCK_FEIERTAGE;

    // ── geschaeftszahlen / rollenbezeichnungen ──────────────────────────
    if (endpoint === 'geschaeftszahlen' && m === 'GET') {
      return {
        geschaeftszahl: [
          'GZ-2024-001',
          'GZ-2024-002',
          'GZ-2025-001',
          'GZ-2025-002',
          'GZ-2026-001',
        ],
      };
    }
    if (endpoint === 'rollenbezeichnungen' && m === 'GET') {
      return {
        rollenbezeichnung: [
          'Entwickler',
          'Tester',
          'Projektleiter',
          'Architekt',
          'Analyst',
          'Servicemanager',
        ],
      };
    }

    // Unknown endpoint — indicate pass-through.
    return undefined;
  }
}
