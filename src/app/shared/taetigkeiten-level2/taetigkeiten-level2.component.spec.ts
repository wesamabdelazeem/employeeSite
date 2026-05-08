import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenLevel2Component } from './taetigkeiten-level2.component';

describe('TaetigkeitenLevel2Component', () => {
  let component: TaetigkeitenLevel2Component;
  let fixture: ComponentFixture<TaetigkeitenLevel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenLevel2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
