import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseOpenConfirmDialogComponent } from './close-open-confirm-dialog.component';

describe('CloseOpenConfirmDialogComponent', () => {
  let component: CloseOpenConfirmDialogComponent;
  let fixture: ComponentFixture<CloseOpenConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseOpenConfirmDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseOpenConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
