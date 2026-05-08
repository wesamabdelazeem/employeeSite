import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StundensatzAendeungDialogComponent } from './stundensatz-aendeung-dialog.component';

describe('StundensatzAendeungDialogComponent', () => {
  let component: StundensatzAendeungDialogComponent;
  let fixture: ComponentFixture<StundensatzAendeungDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StundensatzAendeungDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StundensatzAendeungDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
