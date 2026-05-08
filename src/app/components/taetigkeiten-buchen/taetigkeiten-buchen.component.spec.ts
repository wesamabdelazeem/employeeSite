import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaetigkeitenBuchenComponent } from './taetigkeiten-buchen.component';

describe('TaetigkeitenBuchenComponent', () => {
  let component: TaetigkeitenBuchenComponent;
  let fixture: ComponentFixture<TaetigkeitenBuchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaetigkeitenBuchenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaetigkeitenBuchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
