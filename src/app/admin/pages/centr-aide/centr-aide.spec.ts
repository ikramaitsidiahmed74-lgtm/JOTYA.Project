import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCentrAideComponent } from './centr-aide';

describe('AdminCentrAideComponent', () => {
  let component: AdminCentrAideComponent;
  let fixture: ComponentFixture<AdminCentrAideComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCentrAideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCentrAideComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
