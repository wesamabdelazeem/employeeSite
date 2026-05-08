import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenLevel1Component } from './taetigkeiten-level1.component';

describe('TaetigkeitenLevel1Component', () => {
  let component: TaetigkeitenLevel1Component;
  let fixture: ComponentFixture<TaetigkeitenLevel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenLevel1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenLevel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
