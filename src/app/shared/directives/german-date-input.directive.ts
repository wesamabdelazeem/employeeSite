import { Directive, ElementRef, HostListener } from '@angular/core';

const ALLOWED_CHAR = /[0-9.\-\/ ]/;
const DISALLOWED_GLOBAL = /[^0-9.\-\/ ]/g;

@Directive({
  selector: 'input[appGermanDateInput]',
  standalone: true,
})
export class GermanDateInputDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    if (event.key.length === 1 && !ALLOWED_CHAR.test(event.key)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const original = input.value ?? '';
    const cleaned = original.replace(DISALLOWED_GLOBAL, '');
    if (cleaned !== original) {
      input.value = cleaned;
    }
  }

  @HostListener('blur')
  onBlur(): void {
    const input = this.el.nativeElement;
    const formatted = this.formatGermanDate(input.value ?? '');
    if (formatted !== input.value) {
      input.value = formatted;
      // Re-fire input so matDatepicker (or any other listener) re-parses.
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private formatGermanDate(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const parts = trimmed.split(/[^\d]+/).filter(Boolean);
    let dd = '';
    let mm = '';
    let yyyy = '';

    if (parts.length >= 3) {
      [dd, mm, yyyy] = parts;
    } else if (parts.length === 2) {
      [dd, mm] = parts;
    } else if (parts.length === 1) {
      const d = parts[0];
      if (d.length === 8) {
        dd = d.slice(0, 2); mm = d.slice(2, 4); yyyy = d.slice(4);
      } else if (d.length === 6) {
        dd = d.slice(0, 2); mm = d.slice(2, 4); yyyy = d.slice(4);
      } else if (d.length === 7) {
        dd = d.slice(0, 1); mm = d.slice(1, 3); yyyy = d.slice(3);
      } else if (d.length === 5) {
        dd = d.slice(0, 1); mm = d.slice(1, 2); yyyy = d.slice(2);
      } else if (d.length === 4) {
        dd = d.slice(0, 2); mm = d.slice(2);
      } else if (d.length === 3) {
        dd = d.slice(0, 1); mm = d.slice(1);
      } else if (d.length <= 2) {
        dd = d;
      }
    } else {
      return trimmed;
    }

    if (dd) dd = dd.padStart(2, '0').slice(0, 2);
    if (mm) mm = mm.padStart(2, '0').slice(0, 2);
    if (yyyy) {
      if (yyyy.length === 2) {
        yyyy = (Number(yyyy) < 70 ? '20' : '19') + yyyy;
      } else if (yyyy.length === 1) {
        yyyy = '200' + yyyy;
      } else if (yyyy.length === 3) {
        yyyy = '2' + yyyy.padStart(3, '0');
      } else if (yyyy.length > 4) {
        yyyy = yyyy.slice(0, 4);
      }
    }

    if (dd && mm && yyyy) return `${dd}.${mm}.${yyyy}`;
    if (dd && mm) return `${dd}.${mm}`;
    return dd || trimmed;
  }
}
