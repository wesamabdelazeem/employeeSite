import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taetigkeiten-time-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taetigkeiten-time-box.component.html',
  styleUrl: './taetigkeiten-time-box.component.scss'
})
export class TaetigkeitenTimeBoxComponent {
  @Input() value: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 24;
  @Input() step: number = 1;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() decreaseDisabled: boolean = false;
  @Input() increaseDisabled: boolean = false;

  @Output() valueChange = new EventEmitter<number>();

  get nextValue(): number {
    const next = this.value + this.step;
    return next > this.max ? this.min : next;
  }

  get previousValue(): number {
    const prev = this.value - this.step;
    if (prev < this.min) {
      const span = this.max - this.min;
      return this.min + Math.floor(span / this.step) * this.step;
    }
    return prev;
  }

  get canIncrease(): boolean {
    return true;
  }

  get canDecrease(): boolean {
    return true;
  }

  increase(): void {
    if (this.disabled || this.increaseDisabled) return;
    this.valueChange.emit(this.nextValue);
  }

  decrease(): void {
    if (this.disabled || this.decreaseDisabled) return;
    this.valueChange.emit(this.previousValue);
  }

  onInput(event: Event): void {
    if (this.disabled || this.readonly) return;
    const target = event.target as HTMLInputElement;
    const raw = (target.value || '').replace(/\D/g, '');

    if (raw === '') {
      this.valueChange.emit(this.min);
      target.value = String(this.min);
      return;
    }

    const resolved = this.resolveDigits(raw);
    target.value = String(resolved);
    this.valueChange.emit(resolved);
  }

  onWheel(event: WheelEvent): void {
    if (this.disabled || this.readonly) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.deltaY < 0) {
      this.increase();
    } else if (event.deltaY > 0) {
      this.decrease();
    }
  }

  private resolveDigits(raw: string): number {
    const full = parseInt(raw, 10);
    if (!isNaN(full) && full >= this.min && full <= this.max) {
      return full;
    }
    if (raw.length >= 2) {
      const lastTwo = parseInt(raw.slice(-2), 10);
      if (!isNaN(lastTwo) && lastTwo >= this.min && lastTwo <= this.max) {
        return lastTwo;
      }
    }
    const lastOne = parseInt(raw.slice(-1), 10);
    if (!isNaN(lastOne) && lastOne >= this.min && lastOne <= this.max) {
      return lastOne;
    }
    return this.min;
  }
}
