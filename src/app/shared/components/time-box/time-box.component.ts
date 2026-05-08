import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TimeInputDirective} from '../../directives/time-input-directive';

@Component({
  selector: 'app-time-box',
  standalone: true,
  imports: [CommonModule, TimeInputDirective],
  template: `
    <div class="time-box">
      <button
        type="button"
        class="time-btn dash add"
        (click)="onChange(value + 1)"
        [disabled]="disabled"
      >
        {{ value + 1 > max ? 0 : value + 1 }}
      </button>

      <input
        type="text"
        inputmode="numeric"
        class="time-value-display time-value-input"
        [value]="value"
        [disabled]="disabled"
        timeInput
        [timeField]="field"
        [timeMax]="max"
        [timeDisabled]="disabled"
        (timeValueChange)="onChange($event)"
        maxlength="2"
      />

      <button
        type="button"
        class="time-btn dash minus"
        (click)="onChange(value - 1)"
        [disabled]="disabled"
      >
        {{ value - 1 < 0 ? max : value - 1 }}
      </button>
    </div>
  `,
  styles: [`
    .time-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .time-btn {
      border: 1px solid #ccc;
      border-radius: 2px;
      background-color: #f9f9f9;
      width: 40px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #292929;
      font-size: 10px;
      &:hover:not(:disabled) {
        background-color: #e9e9e9;
        border-color: #999;
      }
      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }
    .add { margin-bottom: 2px; }
    .minus { margin-top: 2px; }
    .time-value-display {
      border: 1px solid #ccc;
      border-radius: 2px;
      background-color: #f9f9f9;
      width: 40px;
      height: 28px;
      text-align: center;
      font-size: 14px;
      cursor: default;
      caret-color: transparent;
      user-select: none;
      &:focus {
        outline: none;
        box-shadow: none;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  `]
})
export class TimeBoxComponent {
  @Input() field!: string;
  @Input() value: number = 0;
  @Input() max: number = 24;
  @Input() disabled: boolean = false;
  @Output() valueChange = new EventEmitter<number>();

  onChange(newVal: number): void {
    if (this.disabled) return;
    if (newVal < 0) newVal = this.max;
    if (newVal > this.max) newVal = 0;
    this.valueChange.emit(newVal);
  }
}
