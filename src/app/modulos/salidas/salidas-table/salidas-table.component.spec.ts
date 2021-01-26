import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidasTableComponent } from './salidas-table.component';

describe('SalidasTableComponent', () => {
  let component: SalidasTableComponent;
  let fixture: ComponentFixture<SalidasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidasTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
