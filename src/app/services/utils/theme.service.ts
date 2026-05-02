import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'bmi-theme';

/**
 * App-wide light/dark theme controller.
 *
 * Lives only as long as the JS bundle: persists the user's choice in
 * localStorage so it survives reloads, and reflects the current value
 * by toggling the `dark` class on <html>. The dark palette is defined
 * in `src/styles/_theme.scss` under the `.dark` class.
 *
 * Used initially by the experimental `app-personen-2-*` screens but
 * the toggle works app-wide once the dark palette is opted in.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly subject = new BehaviorSubject<ThemeMode>(this.readInitial());
  readonly current$ = this.subject.asObservable();

  constructor() {
    this.apply(this.subject.value);
  }

  get current(): ThemeMode {
    return this.subject.value;
  }

  set(mode: ThemeMode): void {
    this.apply(mode);
    this.subject.next(mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* ignore */ }
  }

  toggle(): void {
    this.set(this.current === 'dark' ? 'light' : 'dark');
  }

  private apply(mode: ThemeMode): void {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }

  private readInitial(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* ignore */ }
    if (typeof window !== 'undefined' && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
