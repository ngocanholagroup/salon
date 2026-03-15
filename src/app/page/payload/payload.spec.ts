import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Payload } from './payload';

describe('Payload', () => {
  let component: Payload;
  let fixture: ComponentFixture<Payload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Payload],
    }).compileComponents();

    fixture = TestBed.createComponent(Payload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
