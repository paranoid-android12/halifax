import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseDialogComponent } from './browse-dialog.component';

describe('BrowseDialogComponent', () => {
  let component: BrowseDialogComponent;
  let fixture: ComponentFixture<BrowseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
