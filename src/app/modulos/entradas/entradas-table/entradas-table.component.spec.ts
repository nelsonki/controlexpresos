import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradasTableComponent } from './entradas-table.component';

describe('EntradasTableComponent', () => {
  let component: EntradasTableComponent;
  let fixture: ComponentFixture<EntradasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntradasTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
