import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aide } from './aide';

describe('Aide', () => {
  let component: Aide;
  let fixture: ComponentFixture<Aide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aide);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
