import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenLevel3Component } from './taetigkeiten-level3.component';

describe('TaetigkeitenLevel3Component', () => {
  let component: TaetigkeitenLevel3Component;
  let fixture: ComponentFixture<TaetigkeitenLevel3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenLevel3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
