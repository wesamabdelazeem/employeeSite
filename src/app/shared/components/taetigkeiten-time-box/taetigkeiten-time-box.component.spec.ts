import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenTimeBoxComponent } from './taetigkeiten-time-box.component';

describe('TaetigkeitenTimeBoxComponent', () => {
  let component: TaetigkeitenTimeBoxComponent;
  let fixture: ComponentFixture<TaetigkeitenTimeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenTimeBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenTimeBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
