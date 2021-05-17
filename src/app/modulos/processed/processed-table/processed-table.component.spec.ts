import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedTableComponent } from './processed-table.component';

describe('ProcessedTableComponent', () => {
  let component: ProcessedTableComponent;
  let fixture: ComponentFixture<ProcessedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
