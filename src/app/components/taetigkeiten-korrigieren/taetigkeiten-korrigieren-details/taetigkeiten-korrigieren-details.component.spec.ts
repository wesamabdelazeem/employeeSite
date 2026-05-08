import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenKorrigierenDetailsComponent } from './taetigkeiten-korrigieren-details.component';

describe('TaetigkeitenKorrigierenDetailsComponent', () => {
  let component: TaetigkeitenKorrigierenDetailsComponent;
  let fixture: ComponentFixture<TaetigkeitenKorrigierenDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenKorrigierenDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenKorrigierenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
