import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenHistorischDetailsComponent } from './taetigkeiten-historisch-details.component';

describe('TaetigkeitenHistorischDetailsComponent', () => {
  let component: TaetigkeitenHistorischDetailsComponent;
  let fixture: ComponentFixture<TaetigkeitenHistorischDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenHistorischDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenHistorischDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
